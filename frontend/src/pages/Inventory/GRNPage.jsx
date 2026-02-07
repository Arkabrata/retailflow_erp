import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

/* ===================== GRN Page ===================== */

export default function GRNPage() {
  const [poList, setPoList] = useState([]);
  const [grnList, setGrnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [grnDate, setGrnDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedPoId, setSelectedPoId] = useState("");
  const [lines, setLines] = useState([]);

  /* ===================== LOAD DATA ===================== */

  const loadPOs = async () => {
    const res = await axios.get(`${API_BASE}/purchase-orders`);
    setPoList(res.data || []);
  };

  const loadGrns = async () => {
    const res = await axios.get(`${API_BASE}/grn`);
    setGrnList(res.data || []);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([loadPOs(), loadGrns()]);
      } catch (err) {
        console.error("Failed loading GRN data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedPo = poList.find(
    (p) => String(p.id) === String(selectedPoId)
  );

  /* ===================== PO CHANGE ===================== */

  const handlePoChange = (poId) => {
    setSelectedPoId(poId);

    const po = poList.find((p) => String(p.id) === String(poId));
    if (!po) {
      setLines([]);
      return;
    }

    setLines(
      po.lines.map((ln) => ({
        sku_code: ln.sku_code,
        description: ln.description,
        orderedQty: ln.qty,
        received_qty: ln.qty,
        accepted_qty: ln.qty,
        rejected_qty: 0,
      }))
    );
  };

  /* ===================== LINE UPDATE ===================== */

  const updateLine = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: Number(value) || 0,
      };
      return copy;
    });
  };

  /* ===================== TOTALS ===================== */

  const totals = lines.reduce(
    (a, l) => {
      a.ordered += l.orderedQty || 0;
      a.received += l.received_qty || 0;
      a.accepted += l.accepted_qty || 0;
      a.rejected += l.rejected_qty || 0;
      return a;
    },
    { ordered: 0, received: 0, accepted: 0, rejected: 0 }
  );

  /* ===================== SAVE GRN ===================== */

  const handleSaveGrn = async () => {
    try {
      setSaving(true);

      const payload = {
        grn_number: null,
        po_id: Number(selectedPoId),
        received_date: grnDate,
        remarks: null,
        lines: lines.map((ln) => ({
          sku_code: ln.sku_code,
          received_qty: ln.received_qty,
          accepted_qty: ln.accepted_qty,
          rejected_qty: ln.rejected_qty,
        })),
      };

      await axios.post(`${API_BASE}/grn`, payload);
      await loadGrns();

      setLines([]);
      setSelectedPoId("");
      alert("GRN saved successfully");
    } catch (err) {
      console.error("GRN save failed", err.response?.data || err);
      alert("Failed to save GRN");
    } finally {
      setSaving(false);
    }
  };
  /* ===================== GRN LIST HELPERS ===================== */

  const getGrnTotalQty = (grn) => {
    const linesArr = grn?.lines || [];
    return linesArr.reduce(
      (sum, ln) => sum + (Number(ln.received_qty) || 0),
      0
    );
  };

  const getGrnSkuWiseQty = (grn) => {
    const linesArr = grn?.lines || [];
    return linesArr.reduce((acc, ln) => {
      const sku = ln?.sku_code;
      if (!sku) return acc;
      acc[sku] = (acc[sku] || 0) + (Number(ln.received_qty) || 0);
      return acc;
    }, {});
  };

  /* ===================== UI ===================== */

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>GRN (Goods Receipt Note)</h2>
        <p>Record goods received against Purchase Orders</p>
      </div>

      {/* ===================== CREATE GRN ===================== */}
      <div className="rf-card">
        <div className="rf-grn-header-grid">
          <div className="rf-input-group">
            <label>GRN Date</label>
            <input
              type="date"
              value={grnDate}
              onChange={(e) => setGrnDate(e.target.value)}
            />
          </div>

          <div className="rf-input-group">
            <label>Purchase Order</label>
            <select
              value={selectedPoId}
              onChange={(e) => handlePoChange(e.target.value)}
              disabled={loading}
            >
              <option value="">Select PO</option>
              {poList.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.po_number || `PO-${po.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="rf-input-group">
            <label>Vendor</label>
            <input
              value={selectedPo?.vendor_name || ""}
              disabled
              placeholder="Auto from PO"
            />
          </div>
        </div>

        {/* ===================== LINES ===================== */}
        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-grn">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Ordered</th>
                <th>Received</th>
                <th>Accepted</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Select a PO to load items
                  </td>
                </tr>
              ) : (
                lines.map((ln, i) => (
                  <tr key={i}>
                    <td>{ln.sku_code}</td>
                    <td>{ln.description}</td>
                    <td>{ln.orderedQty}</td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        value={ln.received_qty}
                        onChange={(e) =>
                          updateLine(i, "received_qty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        value={ln.accepted_qty}
                        onChange={(e) =>
                          updateLine(i, "accepted_qty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        value={ln.rejected_qty}
                        onChange={(e) =>
                          updateLine(i, "rejected_qty", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rf-grn-summary">
          <div>Ordered: {totals.ordered}</div>
          <div>Received: {totals.received}</div>
          <div>Accepted: {totals.accepted}</div>
          <div>Rejected: {totals.rejected}</div>
        </div>

        <div className="rf-form-actions">
          <button
            className="rf-primary-btn"
            disabled={!selectedPoId || saving}
            onClick={handleSaveGrn}
          >
            {saving ? "Saving..." : "Save GRN"}
          </button>
        </div>
      </div>
      


      {/* ===================== GRN LIST ===================== */}
      <div className="rf-card" style={{ marginTop: 24 }}>
        <h3>Saved GRNs</h3>

        <table className="rf-table">
          <thead>
            <tr>
              <th>GRN No</th>
              <th>PO ID</th>
              <th>Date</th>
              <th>Total Qty</th>
              <th>SKU-wise Qty</th>
            </tr>
          </thead>

          <tbody>
            {grnList.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No GRNs yet
                </td>
              </tr>
            ) : (
              grnList.map((g) => {
                const totalQty = getGrnTotalQty(g);
                const skuMap = getGrnSkuWiseQty(g);

                return (
                  <tr key={g.id}>
                    <td>{g.grn_number}</td>
                    <td>{g.po_id}</td>
                    <td>{g.received_date}</td>

                    {/* TOTAL RECEIVED QTY */}
                    <td style={{ fontWeight: 600 }}>{totalQty}</td>

                    {/* SKU-WISE RECEIVED QTY */}
                    <td>
                      {Object.keys(skuMap).length === 0 ? (
                        "-"
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {Object.entries(skuMap).map(([sku, qty]) => (
                            <li key={sku}>
                              {sku} : <b>{qty}</b>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
