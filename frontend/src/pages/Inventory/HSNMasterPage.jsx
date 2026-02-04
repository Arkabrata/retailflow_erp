import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

/* ===================== HSN Master Page ===================== */

export default function HSNMasterPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state for new HSN
  const [newHSN, setNewHSN] = useState({
    hsn_code: "",
    description: "",
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 0,
  });

  const [savingId, setSavingId] = useState(null);

  // ---- Load list from backend on mount ----
  useEffect(() => {
    axios
      .get(`${API_BASE}/hsn`)
      .then((res) => {
        setRows(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("Error loading HSN:", err);
        setError("Failed to load HSN data");
      })
      .finally(() => setLoading(false));
  }, []);

  // ---- Add HSN form handlers ----
  const handleInputChange = (field, value) => {
    setNewHSN((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateHSN = async (e) => {
    e.preventDefault();

    if (!newHSN.hsn_code.trim()) {
      alert("HSN code is required");
      return;
    }

    try {
      const payload = {
        hsn_code: newHSN.hsn_code.trim(),
        description: newHSN.description.trim(),
        cgst_rate: Number(newHSN.cgst_rate) || 0,
        sgst_rate: Number(newHSN.sgst_rate) || 0,
        igst_rate: Number(newHSN.igst_rate) || 0,
      };

      const res = await axios.post(`${API_BASE}/hsn`, payload);

      setRows((prev) => [...prev, res.data]);

      setNewHSN({
        hsn_code: "",
        description: "",
        cgst_rate: 0,
        sgst_rate: 0,
        igst_rate: 0,
      });
    } catch (err) {
      console.error("Error creating HSN:", err);
      alert(
        err.response?.data?.detail || "Failed to create HSN row"
      );
    }
  };

  // ---- Inline editing ----
  const handleFieldChange = (rowId, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSaveRow = async (row) => {
    try {
      setSavingId(row.id);
      const payload = {
        hsn_code: row.hsn_code || "",
        description: row.description || "",
        cgst_rate: Number(row.cgst_rate) || 0,
        sgst_rate: Number(row.sgst_rate) || 0,
        igst_rate: Number(row.igst_rate) || 0,
      };

      await axios.put(`${API_BASE}/hsn/${row.id}`, payload);
    } catch (err) {
      console.error("Error saving HSN:", err);
      alert("Failed to save HSN row");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteRow = async (rowId) => {
    const confirmDelete = window.confirm("Delete this HSN row?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/hsn/${rowId}`);
      setRows((prev) => prev.filter((r) => r.id !== rowId));
    } catch (err) {
      console.error("Error deleting HSN:", err);
      alert("Failed to delete HSN row");
    }
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>HSN Master</h2>
        <p>
          Maintain HSN codes and GST split (CGST, SGST, IGST).
          Item Master, PO, and POS reuse these tax rates.
        </p>
      </div>

      {/* ---- Add HSN Form ---- */}
      <div className="rf-card" style={{ marginBottom: 16, padding: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Add New HSN</h3>

        <form
          onSubmit={handleCreateHSN}
          className="rf-form-grid"
          style={{ alignItems: "flex-end" }}
        >
          <div className="rf-input-group">
            <label>HSN Code</label>
            <input
              className="rf-cell-input"
              value={newHSN.hsn_code}
              onChange={(e) =>
                handleInputChange("hsn_code", e.target.value)
              }
              required
            />
          </div>

          <div className="rf-input-group rf-input-wide">
            <label>Description</label>
            <input
              className="rf-cell-input"
              value={newHSN.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value)
              }
            />
          </div>

          <div className="rf-input-group">
            <label>CGST %</label>
            <input
              type="number"
              className="rf-cell-input"
              value={newHSN.cgst_rate}
              onChange={(e) =>
                handleInputChange("cgst_rate", e.target.value)
              }
            />
          </div>

          <div className="rf-input-group">
            <label>SGST %</label>
            <input
              type="number"
              className="rf-cell-input"
              value={newHSN.sgst_rate}
              onChange={(e) =>
                handleInputChange("sgst_rate", e.target.value)
              }
            />
          </div>

          <div className="rf-input-group">
            <label>IGST %</label>
            <input
              type="number"
              className="rf-cell-input"
              value={newHSN.igst_rate}
              onChange={(e) =>
                handleInputChange("igst_rate", e.target.value)
              }
            />
          </div>

          <div className="rf-input-group">
            <button type="submit" className="rf-primary-btn">
              + Add HSN
            </button>
          </div>
        </form>
      </div>

      {/* ---- Existing HSN Table ---- */}
      <div className="rf-card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>
          Existing HSN Codes
        </h3>

        {loading ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>Loading...</p>
        ) : (
          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-hsn">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>HSN Code</th>
                  <th>Description</th>
                  <th>CGST %</th>
                  <th>SGST %</th>
                  <th>IGST %</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ fontSize: 13 }}>
                      No HSN rows found.
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={row.hsn_code || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "hsn_code",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={row.description || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={row.cgst_rate ?? 0}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "cgst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={row.sgst_rate ?? 0}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "sgst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={row.igst_rate ?? 0}
                        onChange={(e) =>
                          handleFieldChange(
                            row.id,
                            "igst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <button
                        className="rf-text-button"
                        onClick={() => handleSaveRow(row)}
                        disabled={savingId === row.id}
                      >
                        {savingId === row.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="rf-text-button"
                        onClick={() => handleDeleteRow(row.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error && (
          <p style={{ fontSize: 12, color: "#b91c1c", marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}