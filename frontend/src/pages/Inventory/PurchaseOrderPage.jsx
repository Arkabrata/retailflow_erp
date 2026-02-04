import { useEffect, useState } from "react";
import axios from "axios";

/* ===================== API ===================== */
const API_BASE = "http://127.0.0.1:8000/api";

/* ===================== Retailer (shared) ===================== */
const INITIAL_RETAILER = {
  name: "RetailFlow India Pvt Ltd",
  address: "15 Karthik Nagar Main Road, Karthik Nagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560037",
  gstin: "29ZAUPPC5667N1Z2",
  pan: "ZAUPP5667N",
  phone: "+91-8080808080",
  email: "support@retailflow.in",
};

export default function PurchaseOrderPage() {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [hsnList, setHsnList] = useState([]);
  const [poList, setPoList] = useState([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ---- PO Header ---- */
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 60);
  const expiryStr = defaultExpiry.toISOString().slice(0, 10);

  const [header, setHeader] = useState({
    poNumber: "",
    poDate: todayStr,
    vendorId: "",
    paymentTerms: "60 days credit",
    expiryDate: expiryStr,
    remarks: "",
    taxMode: "CGST_SGST",
  });

  /* ---- Line items ---- */
  const makeEmptyLine = () => ({
    sku_code: "",
    description: "",
    qty: 1,
    rate: 0,
    hsn_code: "",
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 0,
    line_subtotal: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 0,
    line_tax: 0,
    line_total: 0,
  });

  const [lines, setLines] = useState([makeEmptyLine()]);

  /* ---- Load master data + existing POs ---- */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [vendorsRes, itemsRes, hsnRes, poRes] = await Promise.all([
          axios.get(`${API_BASE}/vendors`),
          axios.get(`${API_BASE}/items`),
          axios.get(`${API_BASE}/hsn`),
          axios.get(`${API_BASE}/purchase-orders`).catch(() => ({ data: [] })),
        ]);

        setVendors(vendorsRes.data || []);
        setItems(itemsRes.data || []);
        setHsnList(hsnRes.data || []);
        setPoList(poRes.data || []);
      } catch (err) {
        console.error("Failed to load PO masters", err);
      }
    };
    loadAll();
  }, []);

  /* ===================== HELPERS ===================== */

  const handleHeaderChange = (field) => (e) => {
    setHeader((prev) => ({ ...prev, [field]: e.target.value }));
    setMessage("");
  };

  const findItemBySku = (sku) => items.find((it) => it.sku_code === sku);
  const findHsnByCode = (code) => hsnList.find((h) => h.hsn_code === code);

  const recalcLine = (line, taxMode) => {
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const base = qty * rate;

    let cgstAmt = 0,
      sgstAmt = 0,
      igstAmt = 0;

    if (taxMode === "CGST_SGST") {
      cgstAmt = (base * Number(line.cgst_rate || 0)) / 100;
      sgstAmt = (base * Number(line.sgst_rate || 0)) / 100;
    } else {
      igstAmt = (base * Number(line.igst_rate || 0)) / 100;
    }

    const tax = cgstAmt + sgstAmt + igstAmt;

    return {
      ...line,
      line_subtotal: base,
      cgst_amount: cgstAmt,
      sgst_amount: sgstAmt,
      igst_amount: igstAmt,
      line_tax: tax,
      line_total: base + tax,
    };
  };

  const handleLineChange = (index, field, value) => {
    setLines((prev) => {
      const updated = [...prev];
      let line = { ...updated[index], [field]: value };

      if (field === "sku_code") {
        const item = findItemBySku(value);
        if (item) {
          const hsnRow = findHsnByCode(item.hsn_code);
          line.description =
            item.style || `${item.brand || ""} ${item.category || ""}`.trim();
          line.hsn_code = item.hsn_code || "";

          if (hsnRow) {
            line.cgst_rate = hsnRow.cgst_rate || 0;
            line.sgst_rate = hsnRow.sgst_rate || 0;
            line.igst_rate = hsnRow.igst_rate || 0;
          }
        }
      }

      updated[index] = recalcLine(line, header.taxMode);
      return updated;
    });
    setMessage("");
  };

  const handleTaxModeChange = (e) => {
    const mode = e.target.value;
    setHeader((prev) => ({ ...prev, taxMode: mode }));
    setLines((prev) => prev.map((ln) => recalcLine(ln, mode)));
  };

  const addLine = () => setLines((p) => [...p, makeEmptyLine()]);
  const removeLine = (idx) => setLines((p) => p.filter((_, i) => i !== idx));

  const grandTotals = lines.reduce(
    (acc, ln) => {
      acc.subtotal += ln.line_subtotal || 0;
      acc.tax += ln.line_tax || 0;
      acc.total += ln.line_total || 0;
      return acc;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  const selectedVendor = vendors.find((v) => v.id === Number(header.vendorId));

  /* ===================== SAVE PO ===================== */

  const handleSavePo = async () => {
    if (!header.vendorId) {
      setMessage("Select a vendor before saving PO.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const payload = {
        po_number: header.poNumber || null,
        po_date: header.poDate,
        expiry_date: header.expiryDate,
        payment_terms: header.paymentTerms,
        remarks: header.remarks,
        tax_mode: header.taxMode,
        vendor_id: Number(header.vendorId),

        retailer_name: INITIAL_RETAILER.name,
        retailer_address: `${INITIAL_RETAILER.address}, ${INITIAL_RETAILER.city}, ${INITIAL_RETAILER.state} - ${INITIAL_RETAILER.pincode}`,
        retailer_gstin: INITIAL_RETAILER.gstin,

        lines: lines
          .filter((ln) => ln.sku_code && Number(ln.qty) > 0)
          .map((ln) => ({
            sku_code: ln.sku_code,
            description: ln.description,
            qty: Number(ln.qty),
            rate: Number(ln.rate),
            hsn_code: ln.hsn_code,
            cgst_rate: Number(ln.cgst_rate || 0),
            sgst_rate: Number(ln.sgst_rate || 0),
            igst_rate: Number(ln.igst_rate || 0),
            line_total: Number(ln.line_total || 0),
          })),
      };

      const res = await axios.post(`${API_BASE}/purchase-orders`, payload);
      setPoList((prev) => [...prev, res.data]);
      setMessage("PO saved successfully.");
    } catch (err) {
      console.error("Failed to save PO", err);
      setMessage("Error saving PO.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  /* ===================== RENDER ===================== */

  return (
    <div className="rf-content">
      <div className="rf-page">
        <div className="rf-page-header">
          <h2>Purchase Order</h2>
          <p>Create a PO with vendor, items, taxes, and print-ready view.</p>
        </div>

        <div className="rf-card rf-card-wide">
          {/* LEFT: PO FORM */}
          <div className="rf-form">
            {/* Header grid */}
            <div className="rf-form-grid">
              <div className="rf-input-group">
                <label>PO Number</label>
                <input
                  value={header.poNumber}
                  onChange={handleHeaderChange("poNumber")}
                  placeholder="Auto / Enter"
                />
              </div>

              <div className="rf-input-group">
                <label>PO Date</label>
                <input
                  type="date"
                  value={header.poDate}
                  onChange={handleHeaderChange("poDate")}
                />
              </div>

              <div className="rf-input-group">
                <label>Vendor</label>
                <select
                  value={header.vendorId}
                  onChange={handleHeaderChange("vendorId")}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vendor_code} — {v.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rf-input-group">
                <label>Tax Mode</label>
                <select value={header.taxMode} onChange={handleTaxModeChange}>
                  <option value="CGST_SGST">CGST + SGST</option>
                  <option value="IGST">IGST</option>
                </select>
              </div>

              <div className="rf-input-group">
                <label>Payment Terms</label>
                <input
                  value={header.paymentTerms}
                  onChange={handleHeaderChange("paymentTerms")}
                />
              </div>

              <div className="rf-input-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={header.expiryDate}
                  onChange={handleHeaderChange("expiryDate")}
                />
              </div>

              <div className="rf-input-group rf-input-wide">
                <label>Remarks</label>
                <textarea
                  value={header.remarks}
                  onChange={handleHeaderChange("remarks")}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Lines Table */}
            <div className="rf-table-wrapper">
              <table className="rf-table rf-table-po">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Description</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>CGST%</th>
                    <th>SGST%</th>
                    <th>IGST%</th>
                    <th>Line Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((ln, idx) => (
                    <tr key={idx}>
                      <td>
                        <select
                          className="rf-cell-select"
                          value={ln.sku_code}
                          onChange={(e) =>
                            handleLineChange(idx, "sku_code", e.target.value)
                          }
                        >
                          <option value="">Select SKU</option>
                          {items.map((it) => (
                            <option key={it.sku_code} value={it.sku_code}>
                              {it.sku_code}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          value={ln.description || ""}
                          onChange={(e) =>
                            handleLineChange(idx, "description", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          value={ln.hsn_code || ""}
                          onChange={(e) =>
                            handleLineChange(idx, "hsn_code", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          type="number"
                          value={ln.qty}
                          onChange={(e) =>
                            handleLineChange(idx, "qty", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          type="number"
                          value={ln.rate}
                          onChange={(e) =>
                            handleLineChange(idx, "rate", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          type="number"
                          value={ln.cgst_rate}
                          onChange={(e) =>
                            handleLineChange(idx, "cgst_rate", e.target.value)
                          }
                          disabled={header.taxMode !== "CGST_SGST"}
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          type="number"
                          value={ln.sgst_rate}
                          onChange={(e) =>
                            handleLineChange(idx, "sgst_rate", e.target.value)
                          }
                          disabled={header.taxMode !== "CGST_SGST"}
                        />
                      </td>

                      <td>
                        <input
                          className="rf-cell-input"
                          type="number"
                          value={ln.igst_rate}
                          onChange={(e) =>
                            handleLineChange(idx, "igst_rate", e.target.value)
                          }
                          disabled={header.taxMode !== "IGST"}
                        />
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        {(ln.line_total || 0).toFixed(2)}
                      </td>

                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          className="rf-text-button"
                          onClick={() => removeLine(idx)}
                          disabled={lines.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rf-form-actions" style={{ marginTop: 12 }}>
              <button className="rf-primary-btn" onClick={addLine}>
                + Add Line
              </button>

              <button
                className="rf-primary-btn"
                onClick={handleSavePo}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save PO"}
              </button>

              <button className="rf-text-button" onClick={handlePrint}>
                Print
              </button>

              {message && <span className="rf-save-msg">{message}</span>}
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="rf-pos-right">
            <div className="rf-summary-block">
              <h3>Vendor Summary</h3>
              <div className="rf-summary-card">
                <div className="rf-summary-name">
                  {selectedVendor
                    ? `${selectedVendor.vendor_code} — ${selectedVendor.vendor_name}`
                    : "No vendor selected"}
                </div>
                <div className="rf-summary-line">
                  {selectedVendor?.address || "-"}
                </div>
                <div className="rf-summary-line">
                  {selectedVendor?.email || "-"} | {selectedVendor?.phone || "-"}
                </div>
              </div>
            </div>

            <div className="rf-summary-block">
              <h3>Totals</h3>
              <div className="rf-summary-card">
                <div className="rf-pos-summary-row">
                  <span>Subtotal</span>
                  <span>{grandTotals.subtotal.toFixed(2)}</span>
                </div>
                <div className="rf-pos-summary-row">
                  <span>Tax</span>
                  <span>{grandTotals.tax.toFixed(2)}</span>
                </div>
                <div className="rf-pos-summary-row rf-pos-summary-total">
                  <span>Total</span>
                  <span>{grandTotals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rf-summary-block">
              <h3>Retailer</h3>
              <div className="rf-summary-card">
                <div className="rf-summary-name">{INITIAL_RETAILER.name}</div>
                <div className="rf-summary-line">
                  {INITIAL_RETAILER.address}, {INITIAL_RETAILER.city},{" "}
                  {INITIAL_RETAILER.state} - {INITIAL_RETAILER.pincode}
                </div>
                <div className="rf-summary-line">
                  GSTIN: {INITIAL_RETAILER.gstin}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAVED POs LIST (optional) */}
        {poList?.length > 0 && (
          <div style={{ marginTop: 14 }} className="rf-card">
            <div className="rf-table-header">
              <h3>Saved Purchase Orders</h3>
            </div>

            <div className="rf-table-wrapper">
              <table className="rf-table rf-table-po">
                <thead>
                  <tr>
                    <th>PO</th>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {poList.map((po) => (
                    <tr key={po.id || po.po_number}>
                      <td>{po.po_number || "-"}</td>
                      <td>{po.po_date || "-"}</td>
                      <td>{po.vendor_name || po.vendor_id || "-"}</td>
                      <td>{(po.total || 0).toFixed?.(2) ?? po.total ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rf-table-footnote">
              Printing will use the <b>.rf-po-print-area</b> if you wrap it later.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
