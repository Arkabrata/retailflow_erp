// frontend/src/pages/Inventory/InventoryPage.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function InventoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const [invRes, lowRes] = await Promise.all([
        axios.get(`${API_BASE}/inventory`),
        axios.get(`${API_BASE}/inventory/low-stock`),
      ]);

      const inv = Array.isArray(invRes.data) ? invRes.data : [];
      const low = Array.isArray(lowRes.data) ? lowRes.data : [];
      const lowSet = new Set(low.map((x) => x.sku_code));

      setRows(
        inv.map((r) => ({
          ...r,
          available_qty: Number(r.available_qty ?? 0),
          min_stock_level: Number(r.min_stock_level ?? 0),
          is_low: lowSet.has(r.sku_code),
        }))
      );
    } catch (e) {
      console.error(e);
      setErr("Failed to load inventory.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const lowCount = useMemo(
    () => rows.filter((x) => x.is_low).length,
    [rows]
  );

  return (
    <div className="rf-page" style={{ minHeight: "100vh" }}>
      <div className="rf-page-header">
        <h2>Inventory</h2>
        <p>
          Stock overview. Low stock: <b>{lowCount}</b>
        </p>
      </div>

      <div className="rf-card">
        <div className="rf-table-header">
          <h3>All SKUs</h3>
          <button className="rf-primary-btn" onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {err && (
          <div style={{ color: "#dc2626", marginTop: 10, fontWeight: 600 }}>
            {err}
          </div>
        )}

        <div className="rf-table-wrapper" style={{ marginTop: 10 }}>
          <table className="rf-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Style</th>
                <th style={{ textAlign: "right" }}>Available</th>
                <th style={{ textAlign: "right" }}>Min Level</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", color: "#6b7280" }}
                  >
                    {loading ? "Loading..." : "No rows found."}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.sku_code}>
                    <td style={{ fontWeight: 600 }}>{r.sku_code}</td>
                    <td>{r.brand || "-"}</td>
                    <td>{r.category || "-"}</td>
                    <td>{r.style || "-"}</td>
                    <td style={{ textAlign: "right" }}>{r.available_qty}</td>
                    <td style={{ textAlign: "right" }}>{r.min_stock_level}</td>
                    <td>
                      {r.is_low ? (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#fee2e2",
                            color: "#991b1b",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          LOW
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#dcfce7",
                            color: "#166534",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          OK
                        </span>
                      )}
                    </td>
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
