// frontend/src/pages/POS/POSPage.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function POSPage() {
  const [hsnRates, setHsnRates] = useState([]); // from backend
  const [itemOptions, setItemOptions] = useState([]); // from backend

  const [billNumber, setBillNumber] = useState("BILL-0001");
  const [billDate, setBillDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const makeEmptyLine = () => ({
    id: Date.now() + Math.random(),
    sku: "",
    description: "",
    hsnCode: "",
    qty: 1,
    rate: 0,
  });

  const [lines, setLines] = useState([makeEmptyLine()]);
  const [invoices, setInvoices] = useState([]); // from backend
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===================== LOAD MASTER + SALES ===================== */

  const loadHSN = async () => {
    const res = await axios.get(`${API_BASE}/hsn`);
    const data = res.data || [];
    // Map backend fields => ui fields
    setHsnRates(
      data.map((h) => ({
        code: h.hsn_code,
        description: h.description,
        cgst: Number(h.cgst_rate || 0),
        sgst: Number(h.sgst_rate || 0),
        igst: Number(h.igst_rate || 0),
      }))
    );
  };

  const loadItems = async () => {
    const res = await axios.get(`${API_BASE}/items`);
    const data = res.data || [];
    // Map backend fields => ui fields
    // (No assumption about Published-only; we show all. You can filter if needed.)
    setItemOptions(
      data.map((it) => ({
        id: it.id,
        sku: it.sku_code,
        name:
          it.style ||
          `${it.brand || ""} ${it.category || ""}`.trim() ||
          it.sku_code,
        hsnCode: it.hsn_code || "",
        rate: 0, // you don’t store selling MRP now; keep editable
        status: it.status,
      }))
    );
  };

  const loadSales = async () => {
    const res = await axios.get(`${API_BASE}/sales`);
    const data = res.data || [];
    setInvoices(
      data.map((s) => ({
        id: s.id,
        billNumber: s.bill_number,
        billDate: s.sale_date,
        customerName: s.customer_name || "Walk-in",
        customerEmail: s.customer_email || "",
        customerPhone: s.customer_phone || "",
        subtotal: Number(s.subtotal || 0),
        tax: Number(s.tax_total || 0),
        grandTotal: Number(s.grand_total || 0),
        lineCount: (s.lines || []).length,
      }))
    );

    // Keep Bill No UX: set next bill based on last saved
    if (data.length > 0) {
      const last = data[0]?.bill_number;
      if (last) setBillNumber(getNextBillNumber(last));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([loadHSN(), loadItems(), loadSales()]);
      } catch (e) {
        console.error("POS load failed", e);
        setMsg("Failed to load POS masters/sales.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===================== TAX / TOTALS ===================== */

  const getHsnRates = (hsnCode) => {
    const h = hsnRates.find((x) => x.code === hsnCode);
    return h || { cgst: 0, sgst: 0, igst: 0 };
  };

  const computeLine = (line) => {
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const base = qty * rate;

    const { cgst, sgst, igst } = getHsnRates(line.hsnCode);
    const cgstAmt = (base * (Number(cgst) || 0)) / 100;
    const sgstAmt = (base * (Number(sgst) || 0)) / 100;
    const igstAmt = (base * (Number(igst) || 0)) / 100;

    const tax = cgstAmt + sgstAmt + igstAmt;
    const total = base + tax;

    return { base, tax, total, cgstAmt, sgstAmt, igstAmt, cgst, sgst, igst };
  };

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        const { base, tax, total } = computeLine(line);
        acc.subtotal += base;
        acc.tax += tax;
        acc.grandTotal += total;
        return acc;
      },
      { subtotal: 0, tax: 0, grandTotal: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, hsnRates]);

  /* ===================== LINES ===================== */

  const addLine = () => {
    setLines((prev) => [...prev, makeEmptyLine()]);
    setMsg("");
  };

  const removeLine = (lineId) => {
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((l) => l.id !== lineId)
    );
    setMsg("");
  };

  const updateLineField = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setMsg("");
  };

  const handleSkuChange = (index, sku) => {
    const item = itemOptions.find((it) => it.sku === sku);

    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        sku: item ? item.sku : "",
        description: item ? item.name : "",
        hsnCode: item ? item.hsnCode : "",
        rate: item ? item.rate : 0,
      };
      return copy;
    });

    setMsg("");
  };

  /* ===================== BILL NUMBER ===================== */

  const getNextBillNumber = (current) => {
    const match = String(current).match(/(\d+)$/);
    if (!match) return "BILL-0001";
    const num = parseInt(match[1], 10) + 1;
    return `BILL-${String(num).padStart(4, "0")}`;
  };

  /* ===================== SAVE BILL (POST /sales) ===================== */

  const handleNewBill = async () => {
    const validLines = lines.filter(
      (l) => l.sku && (Number(l.qty) || 0) > 0
    );
    if (!validLines.length || totals.grandTotal <= 0) {
      setMsg("Add at least 1 SKU to create a bill.");
      return;
    }

    try {
      setSaving(true);
      setMsg("");

      const payload = {
        bill_number: billNumber, // backend keeps unique; you can also send null
        sale_date: billDate,
        customer_name: customerName || "Walk-in",
        customer_email: customerEmail || null,
        customer_phone: customerPhone || null,
        subtotal: totals.subtotal,
        tax_total: totals.tax,
        grand_total: totals.grandTotal,
        lines: validLines.map((l) => {
          const c = computeLine(l);
          return {
            sku_code: l.sku,
            description: l.description,
            hsn_code: l.hsnCode || null,
            qty: Number(l.qty) || 0,
            rate: Number(l.rate) || 0,
            cgst_rate: Number(c.cgst || 0),
            sgst_rate: Number(c.sgst || 0),
            igst_rate: Number(c.igst || 0),
            line_subtotal: Number(c.base || 0),
            line_tax: Number(c.tax || 0),
            line_total: Number(c.total || 0),
          };
        }),
      };

      await axios.post(`${API_BASE}/sales`, payload);

      // Refresh bills from backend
      await loadSales();

      // Reset for next bill
      setBillNumber((prev) => getNextBillNumber(prev));
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setLines([makeEmptyLine()]);
      setMsg("Bill saved. Inventory updated.");
    } catch (err) {
      console.error("Sale save failed", err.response?.data || err);
      const detail =
        err.response?.data?.detail ||
        "Failed to save bill (check stock / server).";
      setMsg(String(detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>POS - Sale</h2>
        <p>Create sales invoices by adding SKUs. GST is applied from HSN rates.</p>
      </div>

      <div className="rf-card rf-pos-layout">
        {/* LEFT */}
        <div className="rf-pos-left">
          <div className="rf-pos-header-grid">
            <div className="rf-input-group">
              <label>Bill No.</label>
              <input type="text" value={billNumber} disabled />
            </div>
            <div className="rf-input-group">
              <label>Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="rf-table-header" style={{ marginTop: 12 }}>
            <h3>Cart Items</h3>
            <button
              type="button"
              className="rf-primary-btn"
              onClick={addLine}
              disabled={loading}
            >
              + Add Item
            </button>
          </div>

          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-pos">
              <thead>
                <tr>
                  <th style={{ width: 220 }}>SKU</th>
                  <th>Description</th>
                  <th style={{ width: 90 }}>Qty</th>
                  <th style={{ width: 110 }}>Rate</th>
                  <th style={{ width: 150, textAlign: "right" }}>Line Total</th>
                  <th style={{ width: 90 }} />
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const { total } = computeLine(line);

                  return (
                    <tr key={line.id}>
                      <td>
                        <select
                          className="rf-cell-select"
                          value={line.sku}
                          onChange={(e) =>
                            handleSkuChange(index, e.target.value)
                          }
                          disabled={loading}
                        >
                          <option value="">Select SKU</option>
                          {itemOptions.map((it) => (
                            <option key={it.id} value={it.sku}>
                              {it.sku}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ color: "#111827" }}>
                        {line.description || "-"}
                      </td>

                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.qty}
                          min="1"
                          onChange={(e) =>
                            updateLineField(index, "qty", e.target.value)
                          }
                          disabled={loading}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.rate}
                          min="0"
                          onChange={(e) =>
                            updateLineField(index, "rate", e.target.value)
                          }
                          disabled={loading}
                        />
                      </td>

                      <td style={{ textAlign: "right" }}>
                        {total.toFixed(2)}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => removeLine(line.id)}
                          disabled={lines.length <= 1 || loading}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {msg && (
            <p
              style={{
                marginTop: 10,
                fontSize: 12,
                color:
                  String(msg).toLowerCase().includes("failed") ||
                  String(msg).toLowerCase().includes("insufficient") ||
                  String(msg).toLowerCase().includes("no stock")
                    ? "#dc2626"
                    : "#16a34a",
              }}
            >
              {msg}
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="rf-pos-right">
          <div className="rf-pos-panel">
            <h3>Customer</h3>

            <div className="rf-input-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in"
                disabled={loading}
              />
            </div>

            <div className="rf-input-group">
              <label>Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                disabled={loading}
              />
            </div>

            <div className="rf-input-group">
              <label>Mobile</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile"
                disabled={loading}
              />
            </div>
          </div>

          <div className="rf-pos-panel">
            <h3>Bill Summary</h3>

            <div className="rf-pos-summary-row">
              <span>Subtotal</span>
              <span>₹ {totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="rf-pos-summary-row">
              <span>GST Total</span>
              <span>₹ {totals.tax.toFixed(2)}</span>
            </div>
            <div className="rf-pos-summary-row rf-pos-summary-total">
              <span>Grand Total</span>
              <span>₹ {totals.grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="rf-primary-btn"
              style={{ marginTop: 10, width: "100%" }}
              onClick={handleNewBill}
              disabled={loading || saving}
            >
              {saving ? "Saving..." : "New Bill"}
            </button>

            <p className="rf-table-footnote" style={{ marginTop: 8 }}>
              Saves to DB + deducts inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Saved invoices */}
      <div className="rf-card" style={{ marginTop: 18 }}>
        <div className="rf-table-header">
          <h3>Saved Bills</h3>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {invoices.length} bills
          </div>
        </div>

        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-pos-invoices">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "right" }}>Lines</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ fontSize: 13, color: "#6b7280" }}>
                    No bills yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.billNumber}</td>
                    <td>{inv.billDate}</td>
                    <td>{inv.customerName}</td>
                    <td>{inv.customerPhone || "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      ₹ {inv.grandTotal.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>{inv.lineCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
