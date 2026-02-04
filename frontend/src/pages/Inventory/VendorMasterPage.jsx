import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function VendorMasterPage() {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [vendorRes, itemRes] = await Promise.all([
          axios.get(`${API_BASE}/vendors`),
          axios.get(`${API_BASE}/items`),
        ]);
        setVendors(vendorRes.data);
        setItems(itemRes.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddVendor = async () => {
    const name = window.prompt("Enter Vendor Name");
    if (!name?.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/vendors`, {
        vendor_name: name.trim(),
        tagged_skus: [],
        status: "Active",
      });
      setVendors((p) => [...p, res.data]);
    } catch (err) {
      alert("Failed to create vendor");
    }
  };

  const updateField = (id, field, value) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addSku = (id, sku) => {
    if (!sku) return;
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id && !v.tagged_skus.includes(sku)
          ? { ...v, tagged_skus: [...v.tagged_skus, sku] }
          : v
      )
    );
  };

  const removeSku = (id, sku) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, tagged_skus: v.tagged_skus.filter((s) => s !== sku) }
          : v
      )
    );
  };

  const saveVendor = async (v) => {
    try {
      setSavingId(v.id);
      await axios.put(`${API_BASE}/vendors/${v.id}`, v);
    } catch {
      alert("Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    await axios.delete(`${API_BASE}/vendors/${id}`);
    setVendors((p) => p.filter((v) => v.id !== id));
  };

  return (
    <div className="rf-content">
      <div className="rf-page">
        <div className="rf-page-header">
          <h2>Vendor Master</h2>
          <p>Maintain vendor records and SKU tagging</p>
        </div>

        <div className="rf-card">
          <div className="rf-table-header">
            <h3>Vendors</h3>
            <button className="rf-primary-btn" onClick={handleAddVendor}>
              + Add Vendor
            </button>
          </div>

          {loading ? (
            <p className="rf-table-footnote">Loading…</p>
          ) : (
            <div className="rf-table-wrapper">
              <table className="rf-table rf-table-vendors">
                <thead>
                  <tr>
                    <th>Vendor Code</th>
                    <th>Vendor Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Tagged SKUs</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vendors.map((v) => {
                    const availableSkus = items
                      .map((i) => i.sku_code)
                      .filter((s) => !v.tagged_skus.includes(s));

                    return (
                      <tr key={v.id}>
                        <td>{v.vendor_code}</td>

                        <td>
                          <input
                            className="rf-cell-input"
                            value={v.vendor_name || ""}
                            onChange={(e) =>
                              updateField(v.id, "vendor_name", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            className="rf-cell-input"
                            value={v.address || ""}
                            onChange={(e) =>
                              updateField(v.id, "address", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            className="rf-cell-input"
                            value={v.email || ""}
                            onChange={(e) =>
                              updateField(v.id, "email", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <input
                            className="rf-cell-input"
                            value={v.phone || ""}
                            onChange={(e) =>
                              updateField(v.id, "phone", e.target.value)
                            }
                          />
                        </td>

                        <td>
                          <div className="rf-sku-chips">
                            {v.tagged_skus.map((sku) => (
                              <span key={sku} className="rf-sku-chip">
                                {sku}
                                <button
                                  className="rf-text-button"
                                  onClick={() => removeSku(v.id, sku)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          <select
                            className="rf-cell-select"
                            onChange={(e) => {
                              addSku(v.id, e.target.value);
                              e.target.value = "";
                            }}
                          >
                            <option value="">+ Add SKU</option>
                            {availableSkus.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <select
                            className="rf-cell-select"
                            value={v.status}
                            onChange={(e) =>
                              updateField(v.id, "status", e.target.value)
                            }
                          >
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </td>

                        <td>
                          <button
                            className="rf-primary-btn"
                            disabled={savingId === v.id}
                            onClick={() => saveVendor(v)}
                          >
                            {savingId === v.id ? "Saving…" : "Save"}
                          </button>
                          <button
                            className="rf-text-button"
                            style={{ marginLeft: 8 }}
                            onClick={() => deleteVendor(v.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {error && <p className="rf-login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
