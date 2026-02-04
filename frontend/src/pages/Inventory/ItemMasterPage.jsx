import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function ItemMasterPage() {
  const [items, setItems] = useState([]);
  const [hsnList, setHsnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  // ---- Load items + HSN from backend on mount ----
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [itemsRes, hsnRes] = await Promise.all([
          axios.get(`${API_BASE}/items`),
          axios.get(`${API_BASE}/hsn`),
        ]);
        setItems(itemsRes.data);
        setHsnList(hsnRes.data);
        setError("");
      } catch (err) {
        console.error("Error loading Item Master:", err);
        setError("Failed to load Item Master data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ---- Add Row → create item in DB ----
  const handleAddRow = async () => {
    const sku = window.prompt("Enter new SKU code");
    if (!sku || !sku.trim()) return;

    try {
      const payload = {
        sku_code: sku.trim(),
        brand: "",
        division: "",
        category: "",
        sub_category: "",
        style: "",
        color: "",
        size: "",
        hsn_code: "",
        status: "DRAFT",
        image_path: null,
      };

      const res = await axios.post(`${API_BASE}/items`, payload);
      setItems((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating item:", err);
      alert(
        err.response?.data?.detail ||
          "Failed to create item. Check console."
      );
    }
  };

  // ---- Inline editing ----
  const handleFieldChange = (itemId, field, value) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, [field]: value } : it
      )
    );
  };

  // ---- Save one row ----
  const handleSaveItem = async (item) => {
    try {
      setSavingId(item.id);
      const payload = {
        sku_code: item.sku_code.trim(),
        brand: item.brand || "",
        division: item.division || "",
        category: item.category || "",
        sub_category: item.sub_category || "",
        style: item.style || "",
        color: item.color || "",
        size: item.size || "",
        hsn_code: item.hsn_code || "",
        status: item.status || "DRAFT",
        image_path: item.image_path || null,
      };
      await axios.put(`${API_BASE}/items/${item.id}`, payload);
    } catch (err) {
      console.error("Error saving item:", err);
      alert("Failed to save item");
    } finally {
      setSavingId(null);
    }
  };

  // ---- Delete row ----
  const handleDeleteItem = async (itemId) => {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/items/${itemId}`);
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
  };

  // ---- Image upload (frontend only) ----
  const handleImageChange = (itemId, file) => {
    if (!file) return;

    const fileName = file.name;
    const previewUrl = URL.createObjectURL(file);

    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, image_path: fileName, _previewUrl: previewUrl }
          : it
      )
    );
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Item Master</h2>
        <p>
          Maintain SKU-level details. Only items with status{" "}
          <strong>Published</strong> will be used in POS.
        </p>
      </div>

      <div className="rf-card">
        <div className="rf-table-header">
          <h3>Items</h3>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={handleAddRow}
          >
            + Add Row
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Loading...</p>
        ) : (
          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-items">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Division</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Style</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>HSN</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ fontSize: "13px" }}>
                      No items found. Click <strong>+ Add Row</strong>.
                    </td>
                  </tr>
                )}

                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(item.id, e.target.files?.[0])
                        }
                      />
                      {item._previewUrl && (
                        <img
                          src={item._previewUrl}
                          alt="preview"
                          className="rf-item-image"
                        />
                      )}
                    </td>

                    <td>
                      <input
                        value={item.sku_code || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "sku_code",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.brand || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "brand", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.division || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "division", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.category || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "category", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.sub_category || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "sub_category",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.style || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "style", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.color || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "color", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        value={item.size || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "size", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <select
                        value={item.hsn_code || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "hsn_code",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select HSN</option>
                        {hsnList.map((h) => (
                          <option key={h.id} value={h.hsn_code}>
                            {h.hsn_code}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        value={item.status || "DRAFT"}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => handleSaveItem(item)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
          <p style={{ color: "#b91c1c", marginTop: 8 }}>{error}</p>
        )}
      </div>
    </div>
  );
}