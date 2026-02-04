
// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000/api";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("pos"); // default screen
  const [currentUser, setCurrentUser] = useState(null);

    // Hard-coded users for now
  const demoUsers = [
    { username: "admin", password: "admin123", role: "Admin" },
    { username: "store", password: "store123", role: "Store Manager" },
    { username: "inventory", password: "inv123", role: "Inventory Manager" },
    { username: "sales", password: "sales123", role: "Sales Manager" },
  ];

  const handleLogin = (username, password) => {
    const match = demoUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (!match) {
      return { success: false, message: "Invalid username or password" };
    }
    setCurrentUser({ username: match.username, role: match.role });
    setActiveSection("pos"); // default page after login
    return { success: true };
  };
    // Which sections each role can access
  const roleAccess = {
    Admin: [
      "pos",
      "inventory",
      "itemMaster",
      "hsnMaster",
      "suppliers",
      "vendorMaster",
      "purchaseOrders",
      "grn",
      "analytics",
      "settings",
      "retailerProfile",
      "users",
    ],
    "Store Manager": ["pos", "analytics"],
    "Inventory Manager": [
      "inventory",
      "itemMaster",
      "hsnMaster",
      "suppliers",
      "vendorMaster",
      "purchaseOrders",
      "grn",
    ],
    "Sales Manager": ["pos", "analytics"],
  };

  const canAccess = (section) => {
    if (!currentUser) return false;
    const allowed = roleAccess[currentUser.role] || [];
    return allowed.includes(section);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If no user logged in, show login screen only
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }


  return (
    <div className="rf-app">
      {/* Top bar */}
      <header className="rf-topbar">
        <button
          className="rf-menu-button"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
         ☰
        </button>
        <div className="rf-topbar-title">RetailFlow</div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
        <span className="rf-topbar-user">
         {currentUser?.username} ({currentUser?.role})
        </span>
        <button type="button" className="rf-secondary-btn" onClick={handleLogout}>
         Logout
        </button>
      </div>
    </header>


      {/* Main layout */}
      <div className="rf-layout">
        {/* Sidebar */}
        <aside
          className={`rf-sidebar ${isCollapsed ? "rf-sidebar-collapsed" : ""}`}
        >
          <div className="rf-sidebar-header">
            {isCollapsed ? "RF" : "RetailFlow"}
          </div>

          <nav className="rf-sidebar-nav">
            
            {/* POS / Sale */}
            <button
              className={`rf-sidebar-item ${
                activeSection === "pos" ? "rf-sidebar-item-active" : ""
              }`}
              onClick={() => setActiveSection("pos")}
            >
              <span className="rf-sidebar-icon"></span>
              {!isCollapsed && <span>POS - Sale</span>}
            </button>

            {/* Inventory parent */}
            <button
              className={`rf-sidebar-item ${
                activeSection === "inventory" ||
                activeSection === "itemMaster"||
                activeSection === "hsnMaster"
                  ? "rf-sidebar-item-active"
                  : ""
              }`}
              onClick={() => setActiveSection("inventory")}
            >
              <span className="rf-sidebar-icon"></span>
              {!isCollapsed && <span>Inventory</span>}
            </button>

            {/* Nested under Inventory */}
            {!isCollapsed && (
               <div className="rf-sidebar-subnav">
                 <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "itemMaster" ? "rf-sidebar-item-active" : ""
                  }`}
                  onClick={() => setActiveSection("itemMaster")}
                >
                  <span>Item Master</span>
                </button>

                <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "hsnMaster" ? "rf-sidebar-item-active" : ""
                  }`}
                  onClick={() => setActiveSection("hsnMaster")}
                >
                  <span>HSN Master</span>
                </button>
              </div>
            )}


            {/* Suppliers parent */}
            <button
              className={`rf-sidebar-item ${
                activeSection === "suppliers" ||
                activeSection === "vendorMaster"||
                activeSection === "purchaseOrders"||
                activeSection === "grn"
                  ? "rf-sidebar-item-active"
                  : ""
              }`}
              onClick={() => setActiveSection("suppliers")}
            >
              <span className="rf-sidebar-icon"></span>
              {!isCollapsed && <span>Suppliers</span>}
            </button>

            {/* Nested under Suppliers */}
            {!isCollapsed && (
              <div className="rf-sidebar-subnav">
                <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "vendorMaster"
                      ? "rf-sidebar-item-active"
                      : ""
                  }`}
                  onClick={() => setActiveSection("vendorMaster")}
                >
                  <span className="rf-sidebar-icon"></span>
                  <span>Vendor Master</span>
                </button>
                <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "purchaseOrders" ? "rf-sidebar-item-active" : ""
                  }`}
                  onClick={() => setActiveSection("purchaseOrders")}
                >
                  <span>Purchase Orders</span>
                </button>
                <button
                 className={`rf-sidebar-item rf-sidebar-subitem ${
                  activeSection === "grn" ? "rf-sidebar-item-active" : ""
                }`}
                onClick={() => setActiveSection("grn")}
              >
                <span>GRN</span>
              </button>

              </div>
            )}


            {/* Analytics */}
            <button
              className={`rf-sidebar-item ${
                activeSection === "analytics" ? "rf-sidebar-item-active" : ""
              }`}
              onClick={() => setActiveSection("analytics")}
            >
              <span className="rf-sidebar-icon"></span>
              {!isCollapsed && <span>Analytics</span>}
            </button>

            {/* Settings parent */}
            <button
              className={`rf-sidebar-item ${
                activeSection === "settings" ||
                activeSection === "retailerProfile" ||
                activeSection === "users"
                  ? "rf-sidebar-item-active"
                  : ""
              }`}
              onClick={() => setActiveSection("settings")}
            >
              <span className="rf-sidebar-icon"></span>
              {!isCollapsed && <span>Settings</span>}
            </button>

            {/* Nested under Settings */}
            {!isCollapsed && (
              <div className="rf-sidebar-subnav">
                <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "retailerProfile"
                      ? "rf-sidebar-item-active"
                      : ""
                  }`}
                  onClick={() => setActiveSection("retailerProfile")}
                >
                  <span className="rf-sidebar-icon"></span>
                  <span>Retailer Profile</span>
                </button>

                <button
                  className={`rf-sidebar-item rf-sidebar-subitem ${
                    activeSection === "users" ? "rf-sidebar-item-active" : ""
                  }`}
                  onClick={() => setActiveSection("users")}
                >
                  <span className="rf-sidebar-icon"></span>
                  <span>User Management</span>
                </button>
              </div>
            )}
          </nav>
        </aside>

        {/* Main content area */}
        <main className="rf-content">
          {activeSection === "pos" && <POSPage />}

          {activeSection === "inventory" && (
            <>
              <h2>Inventory</h2>
              <p>
                Inventory overview. Use the Item Master to manage SKU-level
                details.
              </p>
            </>
          )}

          {activeSection === "itemMaster" && <ItemMasterPage />}
          {activeSection === "hsnMaster" && <HSNMasterPage />}


          {activeSection === "suppliers" && (
            <>
              <h2>Suppliers</h2>
              <p>
                Manage vendor masters and supplier-wise purchase mappings under
                Vendor Master.
              </p>
            </>
          )}

          {activeSection === "vendorMaster" && <VendorMasterPage />}
          {activeSection === "purchaseOrders" && <PurchaseOrderPage />}
          {activeSection === "grn" && <GRNPage />}



          {activeSection === "analytics" && (
            <>
              <h2>Analytics</h2>
              <p>Sales and inventory analytics dashboards will come here.</p>
            </>
          )}

          {activeSection === "settings" && (
            <>
              <h2>Settings</h2>
              <p>
                Choose an option under Settings, like Retailer Profile or User
                Management.
              </p>
            </>
          )}

          {activeSection === "retailerProfile" && <RetailerProfilePage />}

          {activeSection === "users" && <UserManagementPage />}
        </main>
      </div>
    </div>
  );
}

/* ===================== Item Master Page =====================*/

function ItemMasterPage() {
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
        err.response?.data?.detail || "Failed to create item. Check console."
      );
    }
  };

  // ---- Inline editing: local state change ----
  const handleFieldChange = (itemId, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, [field]: value } : it))
    );
  };

  // ---- Save one row (PUT to backend) ----
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

  // ---- Image upload (front-end only; store file name in DB) ----
  const handleImageChange = (itemId, file) => {
    if (!file) return;

    const fileName = file.name;

    // Only storing file name in DB for now, preview via object URL
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
          Maintain SKU-level details (Brand, Division, Category, Sub Category,
          Style, Color, Size, HSN, Image). Only items with status
          <strong> Published</strong> will later be used for POS billing.
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
                    <td
                      colSpan={12}
                      style={{ fontSize: "13px", color: "#6b7280" }}
                    >
                      No items found. Click <strong>+ Add Row</strong> to create
                      a SKU.
                    </td>
                  </tr>
                )}

                {items.map((item) => (
                  <tr key={item.id}>
                    {/* Image upload cell */}
                    <td>
                      <div className="rf-upload-thumb">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(item.id, e.target.files?.[0])
                          }
                        />
                        {item._previewUrl ? (
                          <img
                            src={item._previewUrl}
                            alt="preview"
                            className="rf-item-image"
                          />
                        ) : item.image_path ? (
                          <span className="rf-upload-placeholder">
                            {item.image_path}
                          </span>
                        ) : (
                          <span className="rf-upload-placeholder">
                            Upload
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Text fields */}
                    <td>
                      <input
                        className="rf-cell-input"
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
                        className="rf-cell-input"
                        value={item.brand || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "brand", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={item.division || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "division", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={item.category || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "category", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
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
                        className="rf-cell-input"
                        value={item.style || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "style", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={item.color || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "color", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="rf-cell-input"
                        value={item.size || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "size", e.target.value)
                        }
                      />
                    </td>

                    {/* HSN dropdown */}
                    <td>
                      <select
                        className="rf-cell-input"
                        value={item.hsn_code || ""}
                        onChange={(e) =>
                          handleFieldChange(item.id, "hsn_code", e.target.value)
                        }
                      >
                        <option value="">Select HSN</option>
                        {hsnList.map((h) => (
                          <option key={h.id} value={h.hsn_code}>
                            {h.hsn_code} – {h.description}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status dropdown */}
                    <td>
                      <select
                        className="rf-cell-input"
                        value={item.status || "DRAFT"}
                        onChange={(e) =>
                          handleFieldChange(item.id, "status", e.target.value)
                        }
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        type="button"
                        className="rf-text-button"
                        onClick={() => handleSaveItem(item)}
                        disabled={savingId === item.id}
                        style={{ marginRight: "8px" }}
                      >
                        {savingId === item.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="rf-text-button"
                        onClick={() => handleDeleteItem(item.id)}
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
          <p style={{ fontSize: "12px", color: "#b91c1c", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <p className="rf-table-footnote">
          Note: HSN is selected per SKU. When we build the PO module later, tax
          (CGST, SGST, IGST) will be picked from the HSN Master based on this
          value. Items with status <strong>Published</strong> will be visible in
          POS.
        </p>
      </div>
    </div>
  );
}

/* ===================== Retailer Profile Page =====================*/ 
// --- Retailer Profile (front-end only, hard-coded) ---

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

function RetailerProfilePage() {
  const [form, setForm] = useState(INITIAL_RETAILER);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setMessage("");
  };

  const handleSave = () => {
    // No backend – just fake a save
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage("Retailer profile updated locally (not saved to server).");
    }, 400);
  };

  const handleReset = () => {
    setForm(INITIAL_RETAILER);
    setMessage("Reset to default hard-coded profile.");
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Retailer Profile</h2>
        <p>
          Store details used on POS bills, exports, and reports.
          This profile is stored only in the browser (no backend).
        </p>
      </div>

      <div className="rf-card rf-card-wide">
        {/* Left: Form */}
        <div className="rf-form">
          <div className="rf-input-group rf-input-wide">
            <label>Retailer / Store Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Rare Rabbit - MG Road"
            />
          </div>

          <div className="rf-input-group rf-input-wide">
            <label>Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={handleChange("address")}
              placeholder="Door no, Street, Area"
            />
          </div>

          <div className="rf-form-grid">
            <div className="rf-input-group">
              <label>City</label>
              <input
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                placeholder="Bengaluru"
              />
            </div>

            <div className="rf-input-group">
              <label>State</label>
              <input
                type="text"
                value={form.state}
                onChange={handleChange("state")}
                placeholder="Karnataka"
              />
            </div>

            <div className="rf-input-group">
              <label>Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={handleChange("pincode")}
                placeholder="560001"
              />
            </div>

            <div className="rf-input-group">
              <label>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="9089482829"
              />
            </div>

            <div className="rf-input-group">
              <label>Email</label>
              <input
                type="text"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="email@domain.com"
              />
            </div>

            <div className="rf-input-group">
              <label>PAN</label>
              <input
                type="text"
                value={form.pan}
                onChange={handleChange("pan")}
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>GSTIN</label>
              <input
                type="text"
                value={form.gstin}
                onChange={handleChange("gstin")}
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
          </div>

          <div className="rf-form-actions" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="rf-primary-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Retailer Profile"}
            </button>
            <button
              type="button"
              className="rf-primary-btn"
              style={{ background: "#6b7280" }}
              onClick={handleReset}
            >
              Reset to Default
            </button>
            {message && <span className="rf-save-msg">{message}</span>}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="rf-summary-block">
          <h3>Preview</h3>
          <div className="rf-summary-card">
            <div className="rf-summary-name">
              {form.name || "Store Name"}
            </div>
            <div className="rf-summary-line">
              {form.address || "Address line"}
            </div>
            <div className="rf-summary-line">
              {form.city || "City"},{" "}
              {form.state || "State"}{" "}
              {form.pincode ? `- ${form.pincode}` : "- PIN"}
            </div>
            <div className="rf-summary-line">
              Phone: {form.phone || "XXXXXXXXXX"}
            </div>
            <div className="rf-summary-line">
              Email: {form.email || "XXXX@XXXXXX"}
            </div>
            <div className="rf-summary-line">
              PAN: {form.pan || "XXXXXXXXXX"}
            </div>
            <div className="rf-summary-line">
              GSTIN: {form.gstin || "XXXXXXXXXXXXXXXXX"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===================== User Management Page =====================*/ 

function UserManagementPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Store Admin", email: "admin@store.com", role: "Admin" },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Store Manager",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newUser = {
      id: Date.now(),
      ...form,
    };

    setUsers((prev) => [...prev, newUser]);
    setForm({ name: "", email: "", role: "Store Manager" });
    setSaved(true);
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>User Management</h2>
        <p>
          Add users like Store Manager, Inventory Manager, Sales Manager, and
          Admin. These roles will control access to different parts of
          RetailFlow.
        </p>
      </div>

      <div className="rf-card rf-card-wide">
        {/* USER FORM */}
        <form className="rf-form" onSubmit={handleSubmit}>
          <div className="rf-form-grid rf-form-grid-users">
            <div className="rf-input-group rf-input-wide">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arka Chakraborty"
              />
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="arka@store.com"
              />
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option>Store Manager</option>
                <option>Inventory Manager</option>
                <option>Sales Manager</option>
                <option>Admin</option>
              </select>
            </div>
          </div>

          <div className="rf-form-actions">
            <button type="submit" className="rf-primary-btn">
              Add User
            </button>
            {saved && (
              <span className="rf-save-msg">
                User added (kept in browser state for now).
              </span>
            )}
          </div>
        </form>

        {/* USER LIST */}
        <div className="rf-users-list">
          <h3>Existing Users</h3>
          {users.length === 0 ? (
            <p className="rf-users-empty">No users added yet.</p>
          ) : (
            <table className="rf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`rf-role-badge rf-role-${u.role
                          .replace(" ", "")
                          .toLowerCase()}`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== Vendor Master Page =====================*/ 
function VendorMasterPage() {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);          // <-- all SKUs from Item Master
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  // ---- Initial load: vendors + items ----
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
        console.error("Error loading Vendor Master:", err);
        setError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ---- Add Vendor (creates row in DB then shows in table) ----
  const handleAddVendor = async () => {
    const name = window.prompt("Enter Vendor Name");
    if (!name || !name.trim()) return;

    try {
      const payload = {
        vendor_name: name.trim(),
        address: "",
        email: "",
        phone: "",
        tagged_skus: [],
        status: "Active",
      };
      const res = await axios.post(`${API_BASE}/vendors`, payload);
      setVendors((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating vendor:", err);
      alert(
        err.response?.data?.detail || "Failed to create vendor. Check console."
      );
    }
  };

  // ---- Local field edits ----
  const handleFieldChange = (vendorId, field, value) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, [field]: value } : v))
    );
  };

  // ---- Tagged SKUs: add from dropdown (Item Master only) ----
  const handleAddTaggedSku = (vendorId, sku) => {
    if (!sku) return;
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== vendorId) return v;
        const current = v.tagged_skus || [];
        if (current.includes(sku)) return v;
        return { ...v, tagged_skus: [...current, sku] };
      })
    );
  };

  // ---- Tagged SKUs: remove one tag ----
  const handleRemoveTaggedSku = (vendorId, sku) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, tagged_skus: (v.tagged_skus || []).filter((s) => s !== sku) }
          : v
      )
    );
  };

  // ---- Save vendor (PUT) ----
  const handleSaveVendor = async (vendor) => {
    try {
      setSavingId(vendor.id);

      const payload = {
        vendor_code: vendor.vendor_code, // keep same code unless backend changes
        vendor_name: vendor.vendor_name || "",
        address: vendor.address || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        tagged_skus: vendor.tagged_skus || [],
        status: vendor.status || "Active",
      };

      await axios.put(`${API_BASE}/vendors/${vendor.id}`, payload);
    } catch (err) {
      console.error("Error saving vendor:", err);
      alert(
        err.response?.data?.detail ||
          "Failed to save vendor. Check console for details."
      );
    } finally {
      setSavingId(null);
    }
  };

  // ---- Delete vendor ----
  const handleDeleteVendor = async (vendorId) => {
    const ok = window.confirm("Delete this vendor?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/vendors/${vendorId}`);
      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
    } catch (err) {
      console.error("Error deleting vendor:", err);
      alert("Failed to delete vendor");
    }
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Vendor Master</h2>
        <p>
          Maintain vendor records with contact details and{" "}
          <strong>SKU tags from Item Master</strong>. Only{" "}
          <strong>Active</strong> vendors will be considered for purchase
          workflows.
        </p>
      </div>

      <div className="rf-card">
        <div className="rf-table-header">
          <h3>Vendors</h3>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={handleAddVendor}
          >
            + Add Vendor
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Loading...</p>
        ) : (
          <div className="rf-table-wrapper">
            <table className="rf-table">
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
                {vendors.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ fontSize: "13px", color: "#6b7280" }}
                    >
                      No vendors found. Click <strong>+ Add Vendor</strong> to
                      create one.
                    </td>
                  </tr>
                )}

                {vendors.map((v) => {
                  const currentSkus = v.tagged_skus || [];

                  // SKUs not yet tagged for this vendor
                  const availableSkus = items
                    .map((it) => it.sku_code)
                    .filter((sku) => sku && !currentSkus.includes(sku));

                  return (
                    <tr key={v.id}>
                      {/* Vendor Code (read-only) */}
                      <td>{v.vendor_code}</td>

                      {/* Vendor Name */}
                      <td>
                        <input
                          className="rf-cell-input"
                          value={v.vendor_name || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              v.id,
                              "vendor_name",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      {/* Address */}
                      <td>
                        <input
                          className="rf-cell-input"
                          value={v.address || ""}
                          onChange={(e) =>
                            handleFieldChange(v.id, "address", e.target.value)
                          }
                        />
                      </td>

                      {/* Email */}
                      <td>
                        <input
                          className="rf-cell-input"
                          value={v.email || ""}
                          onChange={(e) =>
                            handleFieldChange(v.id, "email", e.target.value)
                          }
                        />
                      </td>

                      {/* Phone */}
                      <td>
                        <input
                          className="rf-cell-input"
                          value={v.phone || ""}
                          onChange={(e) =>
                            handleFieldChange(v.id, "phone", e.target.value)
                          }
                        />
                      </td>

                      {/* Tagged SKUs: chips + dropdown (Item Master only) */}
                      <td>
                        <div className="rf-tagged-skus">
                          {currentSkus.map((sku) => (
                            <span key={sku} className="rf-sku-tag">
                              {sku}
                              <button
                                type="button"
                                className="rf-sku-tag-remove"
                                onClick={() =>
                                  handleRemoveTaggedSku(v.id, sku)
                                }
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <select
                          className="rf-cell-input rf-sku-select"
                          onChange={(e) => {
                            const sku = e.target.value;
                            if (sku) {
                              handleAddTaggedSku(v.id, sku);
                              e.target.value = "";
                            }
                          }}
                          value=""
                        >
                          <option value="">
                            {availableSkus.length === 0
                              ? "All SKUs tagged"
                              : "+ Add SKU"}
                          </option>
                          {availableSkus.map((sku) => (
                            <option key={sku} value={sku}>
                              {sku}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status dropdown */}
                      <td>
                        <select
                          className="rf-cell-input"
                          value={v.status || "Active"}
                          onChange={(e) =>
                            handleFieldChange(v.id, "status", e.target.value)
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => handleSaveVendor(v)}
                          disabled={savingId === v.id}
                          style={{ marginRight: "8px" }}
                        >
                          {savingId === v.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => handleDeleteVendor(v.id)}
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

        {error && (
          <p style={{ fontSize: "12px", color: "#b91c1c", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <p className="rf-table-footnote">
          Tagged SKUs are picked <strong>only</strong> from Item Master. Later,
          the PO module will allow selecting vendor + SKU based on this
          mapping.
        </p>
      </div>
    </div>
  );
}

/* ===================== HSN Master Page =====================*/
function HSNMasterPage() {
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

  const [savingId, setSavingId] = useState(null); // row currently saving

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
      if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Failed to create HSN row");
      }
    }
  };

  // ---- Inline editing handlers ----

  // update local state when typing in table cells
  const handleFieldChange = (rowId, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  // save one row to backend (PUT)
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
      // optional: toast/alert
      // alert("HSN updated");
    } catch (err) {
      console.error("Error saving HSN:", err);
      alert("Failed to save HSN row");
    } finally {
      setSavingId(null);
    }
  };

  // delete row from backend + state
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
          Maintain HSN codes and GST split (CGST, SGST, IGST). Item Master, PO,
          and POS reuse these tax rates from the database.
        </p>
      </div>

      {/* ---- Add HSN Form ---- */}
      <div className="rf-card" style={{ marginBottom: "16px", padding: "16px" }}>
        <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>Add New HSN</h3>

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
              onChange={(e) => handleInputChange("hsn_code", e.target.value)}
              placeholder="6105"
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
              placeholder="Men's cotton shirts"
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
            <button
              type="submit"
              className="rf-primary-btn"
              style={{ marginTop: "18px" }}
            >
              + Add HSN
            </button>
          </div>
        </form>
      </div>

      {/* ---- Existing HSN table (editable) ---- */}
      <div className="rf-card">
        <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>Existing HSN Codes</h3>

        {loading ? (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Loading...</p>
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
                    <td colSpan={7} style={{ fontSize: "13px", color: "#6b7280" }}>
                      No HSN rows found. Add a new HSN using the form above.
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
                          handleFieldChange(row.id, "hsn_code", e.target.value)
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
                        className="rf-cell-input rf-tax-input"
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
                        className="rf-cell-input rf-tax-input"
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
                        className="rf-cell-input rf-tax-input"
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
                        type="button"
                        className="rf-text-button"
                        onClick={() => handleSaveRow(row)}
                        disabled={savingId === row.id}
                        style={{ marginRight: "8px" }}
                      >
                        {savingId === row.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        className="rf-text-button"
                        onClick={() => handleDeleteRow(row.id)}
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
          <p style={{ fontSize: "12px", color: "#b91c1c", marginTop: "8px" }}>
            {error}
          </p>
        )}

        <p className="rf-table-footnote">
          Data is stored in <code>retailflow.db</code> (SQLite) via FastAPI.
        </p>
      </div>
    </div>
  );
}

/* ===================== Purchase Order Page =====================*/ 
function PurchaseOrderPage() {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [hsnList, setHsnList] = useState([]);
  const [poList, setPoList] = useState([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ---- PO Header ----
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
    taxMode: "CGST_SGST", // or "IGST"
  });

  // ---- Line items ----
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

  // ---- Load master data + existing POs ----
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

  // ---- Helpers ----

  const handleHeaderChange = (field) => (e) => {
    setHeader((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setMessage("");
  };

  const findItemBySku = (sku) => items.find((it) => it.sku_code === sku);
  const findHsnByCode = (code) => hsnList.find((h) => h.hsn_code === code);

  const recalcLine = (line) => {
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const base = qty * rate;

    const cgstRate = Number(line.cgst_rate) || 0;
    const sgstRate = Number(line.sgst_rate) || 0;
    const igstRate = Number(line.igst_rate) || 0;

    let cgstAmt = 0;
    let sgstAmt = 0;
    let igstAmt = 0;

    if (header.taxMode === "CGST_SGST") {
      cgstAmt = (base * cgstRate) / 100;
      sgstAmt = (base * sgstRate) / 100;
    } else {
      igstAmt = (base * igstRate) / 100;
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
      const newLines = [...prev];
      let line = { ...newLines[index], [field]: value };

      // When SKU is changed, auto-fill description + HSN + tax
      if (field === "sku_code") {
        const item = findItemBySku(value);
        if (item) {
          const hsn = item.hsn_code;
          const hsnRow = findHsnByCode(hsn);

          line.description =
            item.style ||
            `${item.brand || ""} ${item.category || ""}`.trim();
          line.hsn_code = hsn || "";

          if (hsnRow) {
            line.cgst_rate = hsnRow.cgst_rate || 0;
            line.sgst_rate = hsnRow.sgst_rate || 0;
            line.igst_rate = hsnRow.igst_rate || 0;
          }
        }
      }

      // Recalculate totals
      line = recalcLine(line);
      newLines[index] = line;
      return newLines;
    });
    setMessage("");
  };

  const handleTaxModeChange = (e) => {
    const mode = e.target.value;
    setHeader((prev) => ({ ...prev, taxMode: mode }));
    setLines((prev) => prev.map((ln) => recalcLine(ln)));
  };

  const addLine = () => {
    setLines((prev) => [...prev, makeEmptyLine()]);
  };

  const removeLine = (index) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setHeader((prev) => ({
      ...prev,
      poNumber: "",
      poDate: todayStr,
      expiryDate: expiryStr,
      remarks: "",
    }));
    setLines([makeEmptyLine()]);
  };

  const grandTotals = lines.reduce(
    (acc, ln) => {
      acc.subtotal += ln.line_subtotal || 0;
      acc.cgst += ln.cgst_amount || 0;
      acc.sgst += ln.sgst_amount || 0;
      acc.igst += ln.igst_amount || 0;
      acc.tax += ln.line_tax || 0;
      acc.total += ln.line_total || 0;
      return acc;
    },
    { subtotal: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, total: 0 }
  );

  const selectedVendor = vendors.find(
    (v) => v.id === Number(header.vendorId)
  );

  // ---- Save PO to DB ----
  const handleSavePo = async () => {
    try {
      setSaving(true);
      setMessage("");

      if (!header.vendorId) {
        setMessage("Select a vendor before saving PO.");
        setSaving(false);
        return;
      }

      const payload = {
        po_number: header.poNumber || null,
        po_date: header.poDate,
        expiry_date: header.expiryDate,
        payment_terms: header.paymentTerms,
        remarks: header.remarks,
        tax_mode: header.taxMode, // "CGST_SGST" or "IGST"
        vendor_id: Number(header.vendorId),

        retailer_name: INITIAL_RETAILER.name,
        retailer_address: `${INITIAL_RETAILER.address}, ${INITIAL_RETAILER.city}, ${INITIAL_RETAILER.state} - ${INITIAL_RETAILER.pincode}`,
        retailer_gstin: INITIAL_RETAILER.gstin,

        lines: lines
          .filter((ln) => ln.sku_code && ln.qty > 0)
          .map((ln) => ({
            sku_code: ln.sku_code,
            description: ln.description,
            qty: Number(ln.qty) || 0,
            rate: Number(ln.rate) || 0,
            hsn_code: ln.hsn_code,
            cgst_rate: Number(ln.cgst_rate) || 0,
            sgst_rate: Number(ln.sgst_rate) || 0,
            igst_rate: Number(ln.igst_rate) || 0,
            line_subtotal: ln.line_subtotal,
            cgst_amount: ln.cgst_amount,
            sgst_amount: ln.sgst_amount,
            igst_amount: ln.igst_amount,
            line_total: ln.line_total,
          })),
      };

      const res = await axios.post(`${API_BASE}/purchase-orders`, payload);

      setMessage("PO saved successfully.");
      setPoList((prev) => [...prev, res.data]);
      // clearForm();  // enable if you want to reset after save
    } catch (err) {
      console.error("Failed to save PO", err);
      setMessage("Error saving PO. Check console.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Print / Download PDF ----
  const handlePrint = () => {
    window.print();
  };

  // ============== RENDER ==============

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Purchase Order</h2>
        <p>
          Create and manage POs. Data is saved to the database. Use the Print
          button to download a PDF copy.
        </p>
      </div>

      {/* PO Form + Preview (print friendly) */}
      <div className="rf-card rf-card-wide rf-po-print-area">
        {/* Left side: PO header + line items */}
        <div className="rf-form">
          {/* Header */}
          <div className="rf-form-grid">
            <div className="rf-input-group">
              <label>Vendor</label>
              <select
                value={header.vendorId}
                onChange={handleHeaderChange("vendorId")}
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vendor_code} - {v.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rf-input-group">
              <label>PO Number (optional)</label>
              <input
                type="text"
                value={header.poNumber}
                onChange={handleHeaderChange("poNumber")}
                placeholder="Auto / Manual"
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
              <label>PO Expiry Date</label>
              <input
                type="date"
                value={header.expiryDate}
                onChange={handleHeaderChange("expiryDate")}
              />
            </div>

            <div className="rf-input-group">
              <label>Payment Terms</label>
              <input
                type="text"
                value={header.paymentTerms}
                onChange={handleHeaderChange("paymentTerms")}
                placeholder="e.g. 60 days credit"
              />
            </div>

            <div className="rf-input-group">
              <label>Tax Mode</label>
              <select
                value={header.taxMode}
                onChange={handleTaxModeChange}
              >
                <option value="CGST_SGST">
                  Same State (CGST + SGST)
                </option>
                <option value="IGST">Interstate (IGST)</option>
              </select>
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>Remarks</label>
              <input
                type="text"
                value={header.remarks}
                onChange={handleHeaderChange("remarks")}
                placeholder="Optional note to vendor"
              />
            </div>
          </div>

          {/* Line items table */}
          <div className="rf-table-header" style={{ marginTop: 16 }}>
            <h3>PO Line Items</h3>
            <button
              type="button"
              className="rf-primary-btn"
              onClick={addLine}
            >
              + Add Line
            </button>
          </div>

          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-items rf-table-po">
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
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Total</th>
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
                          <option key={it.id} value={it.sku_code}>
                            {it.sku_code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="text"
                        value={ln.description}
                        onChange={(e) =>
                          handleLineChange(
                            idx,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="text"
                        value={ln.hsn_code}
                        onChange={(e) =>
                          handleLineChange(idx, "hsn_code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        min="0"
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
                        min="0"
                        step="0.01"
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
                        min="0"
                        step="0.01"
                        value={ln.cgst_rate}
                        onChange={(e) =>
                          handleLineChange(
                            idx,
                            "cgst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={ln.sgst_rate}
                        onChange={(e) =>
                          handleLineChange(
                            idx,
                            "sgst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="rf-cell-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={ln.igst_rate}
                        onChange={(e) =>
                          handleLineChange(
                            idx,
                            "igst_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>{Number(ln.line_subtotal || 0).toFixed(2)}</td>
                    <td>{Number(ln.line_tax || 0).toFixed(2)}</td>
                    <td>{Number(ln.line_total || 0).toFixed(2)}</td>
                    <td>
                      {lines.length > 1 && (
                        <button
                          type="button"
                          className="rf-link-btn"
                          onClick={() => removeLine(idx)}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals + Actions */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                Subtotal:{" "}
                <strong>{grandTotals.subtotal.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                CGST: <strong>{grandTotals.cgst.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                SGST: <strong>{grandTotals.sgst.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                IGST: <strong>{grandTotals.igst.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                Total Tax: <strong>{grandTotals.tax.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                Grand Total:{" "}
                <strong>{grandTotals.total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="rf-form-actions">
              <button
                type="button"
                className="rf-primary-btn"
                onClick={handleSavePo}
                disabled={saving}
              >
                {saving ? "Saving PO..." : "Save PO"}
              </button>
              <button
                type="button"
                className="rf-primary-btn"
                onClick={handlePrint}
              >
                Print / Download PO
              </button>
              {message && (
                <span className="rf-save-msg" style={{ maxWidth: 260 }}>
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Print-friendly PO preview */}
        <div className="rf-summary-block">
          <h3>PO Preview</h3>
          <div className="rf-summary-card">
            <div className="rf-summary-name">
              {INITIAL_RETAILER.name}
            </div>
            <div className="rf-summary-line">
              {INITIAL_RETAILER.address}, {INITIAL_RETAILER.city},{" "}
              {INITIAL_RETAILER.state} - {INITIAL_RETAILER.pincode}
            </div>
            <div className="rf-summary-line">
              GSTIN: {INITIAL_RETAILER.gstin}
            </div>
            <div className="rf-summary-line">
              Phone: {INITIAL_RETAILER.phone}
            </div>
            <div className="rf-summary-line">
              Email: {INITIAL_RETAILER.email}
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div className="rf-summary-line">
              <strong>PO No:</strong>{" "}
              {header.poNumber || "(auto/manual)"}
            </div>
            <div className="rf-summary-line">
              <strong>PO Date:</strong> {header.poDate}
            </div>
            <div className="rf-summary-line">
              <strong>Valid Till:</strong> {header.expiryDate}
            </div>
            <div className="rf-summary-line">
              <strong>Payment Terms:</strong> {header.paymentTerms}
            </div>
            <div className="rf-summary-line">
              <strong>Tax Mode:</strong>{" "}
              {header.taxMode === "CGST_SGST"
                ? "Same State (CGST+SGST)"
                : "Interstate (IGST)"}
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div className="rf-summary-line">
              <strong>Vendor:</strong>{" "}
              {selectedVendor
                ? `${selectedVendor.vendor_code} - ${selectedVendor.vendor_name}`
                : "Not selected"}
            </div>

            <hr style={{ margin: "8px 0" }} />

            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              <table
                className="rf-table"
                style={{ fontSize: 11, marginTop: 4 }}
              >
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Desc</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines
                    .filter((ln) => ln.sku_code)
                    .map((ln, idx) => (
                      <tr key={idx}>
                        <td>{ln.sku_code}</td>
                        <td>{ln.description}</td>
                        <td>{ln.qty}</td>
                        <td>{ln.rate}</td>
                        <td>{Number(ln.line_total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: 8,
                textAlign: "right",
                fontSize: 12,
              }}
            >
              <div>Subtotal: {grandTotals.subtotal.toFixed(2)}</div>
              <div>Tax: {grandTotals.tax.toFixed(2)}</div>
              <div>
                <strong>Total: {grandTotals.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved POs */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Saved POs</h3>
        <div className="rf-table-wrapper">
          <table className="rf-table">
            <thead>
              <tr>
                <th>PO No</th>
                <th>Date</th>
                <th>Vendor</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {poList.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ fontSize: 13, color: "#6b7280" }}>
                    No POs saved yet.
                  </td>
                </tr>
              )}
              {poList.map((po) => (
                <tr key={po.id}>
                  <td>{po.po_number || po.id}</td>
                  <td>{po.po_date}</td>
                  <td>
                    {po.vendor_code
                      ? `${po.vendor_code} - ${po.vendor_name}`
                      : po.vendor_id}
                  </td>
                  <td>
                    {po.grand_total !== undefined
                      ? Number(po.grand_total).toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
/* ===================== GRN Page =====================*/
function GRNPage() {
  // Mock vendors
  const vendorOptions = [
    { id: 1, name: "ABC Traders" },
    { id: 2, name: "XYZ Fabrics" },
  ];

  // Mock POs with lines (in real app this will come from PO table)
  const poList = [
    {
      id: 1,
      number: "PO0001",
      date: "2025-12-01",
      vendorId: 1,
      lines: [
        {
          id: 11,
          sku: "RR-SHIRT-001",
          description: "Slim Fit Cotton Shirt",
          orderedQty: 100,
        },
        {
          id: 12,
          sku: "RR-TSHIRT-002",
          description: "Graphic Tee",
          orderedQty: 50,
        },
      ],
    },
    {
      id: 2,
      number: "PO0002",
      date: "2025-12-03",
      vendorId: 2,
      lines: [
        {
          id: 21,
          sku: "RR-TROUSER-003",
          description: "Chino Trouser",
          orderedQty: 60,
        },
      ],
    },
  ];

  const [grnNumber] = useState("GRN0001"); // later: auto-generate
  const [grnDate, setGrnDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [selectedPoId, setSelectedPoId] = useState("");
  const [lines, setLines] = useState([]);

  const selectedPo = poList.find((p) => String(p.id) === String(selectedPoId));
  const vendorForPo = selectedPo
    ? vendorOptions.find((v) => v.id === selectedPo.vendorId)
    : null;

  const handlePoChange = (poId) => {
    setSelectedPoId(poId);

    const po = poList.find((p) => String(p.id) === String(poId));
    if (!po) {
      setLines([]);
      return;
    }

    // Initialize GRN lines from PO lines
    const initialLines = po.lines.map((ln) => ({
      id: ln.id,
      sku: ln.sku,
      description: ln.description,
      orderedQty: ln.orderedQty,
      receivedQty: ln.orderedQty, // default
      acceptedQty: ln.orderedQty, // default
      rejectedQty: 0,
    }));

    setLines(initialLines);
  };

  const updateLineField = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      const valNum =
        field === "receivedQty" || field === "acceptedQty" || field === "rejectedQty"
          ? Number(value) || 0
          : value;

      copy[index] = {
        ...copy[index],
        [field]: valNum,
      };
      return copy;
    });
  };

  const computeTotals = () => {
    return lines.reduce(
      (acc, ln) => {
        acc.ordered += Number(ln.orderedQty) || 0;
        acc.received += Number(ln.receivedQty) || 0;
        acc.accepted += Number(ln.acceptedQty) || 0;
        acc.rejected += Number(ln.rejectedQty) || 0;
        return acc;
      },
      { ordered: 0, received: 0, accepted: 0, rejected: 0 }
    );
  };

  const totals = computeTotals();

  const handleSaveGrn = () => {
    console.log("GRN Saved (mock):", {
      grnNumber,
      grnDate,
      poId: selectedPoId,
      vendorId: vendorForPo?.id || null,
      lines,
    });
    alert("GRN data logged to console (mock save).");
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>GRN (Goods Receipt Note)</h2>
        <p>
          Record goods received against a Purchase Order. Capture received,
          accepted, and rejected quantities for each SKU.
        </p>
      </div>

      <div className="rf-card">
        {/* GRN Header */}
        <div className="rf-grn-header-grid">
          <div className="rf-input-group">
            <label>GRN Number</label>
            <input type="text" value={grnNumber} disabled />
          </div>

          <div className="rf-input-group">
            <label>GRN Date</label>
            <input
              type="date"
              value={grnDate}
              onChange={(e) => setGrnDate(e.target.value)}
            />
          </div>

          <div className="rf-input-group">
            <label>PO Number</label>
            <select
              value={selectedPoId}
              onChange={(e) => handlePoChange(e.target.value)}
            >
              <option value="">Select PO</option>
              {poList.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.number} (Vendor {po.vendorId})
                </option>
              ))}
            </select>
          </div>

          <div className="rf-input-group">
            <label>Vendor</label>
            <input
              type="text"
              value={vendorForPo ? vendorForPo.name : ""}
              disabled
              placeholder="Auto from PO"
            />
          </div>
        </div>

        {/* GRN Lines */}
        <div className="rf-table-header">
          <h3>Received Items</h3>
        </div>

        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-grn">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Ordered Qty</th>
                <th>Received Qty</th>
                <th>Accepted Qty</th>
                <th>Rejected Qty</th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>
                    Select a PO to load lines.
                  </td>
                </tr>
              ) : (
                lines.map((ln, index) => (
                  <tr key={ln.id}>
                    <td>{ln.sku}</td>
                    <td>{ln.description}</td>
                    <td>{ln.orderedQty}</td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input rf-grn-number-input"
                        value={ln.receivedQty}
                        min="0"
                        onChange={(e) =>
                          updateLineField(index, "receivedQty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input rf-grn-number-input"
                        value={ln.acceptedQty}
                        min="0"
                        onChange={(e) =>
                          updateLineField(index, "acceptedQty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input rf-grn-number-input"
                        value={ln.rejectedQty}
                        min="0"
                        onChange={(e) =>
                          updateLineField(index, "rejectedQty", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* GRN Totals */}
        <div className="rf-grn-summary">
          <div className="rf-grn-summary-row">
            <span>Ordered Qty</span>
            <span>{totals.ordered}</span>
          </div>
          <div className="rf-grn-summary-row">
            <span>Received Qty</span>
            <span>{totals.received}</span>
          </div>
          <div className="rf-grn-summary-row">
            <span>Accepted Qty</span>
            <span>{totals.accepted}</span>
          </div>
          <div className="rf-grn-summary-row">
            <span>Rejected Qty</span>
            <span>{totals.rejected}</span>
          </div>
        </div>

        <div className="rf-form-actions" style={{ marginTop: "16px" }}>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={handleSaveGrn}
            disabled={!selectedPoId}
          >
            Save GRN (Mock)
          </button>
          <span className="rf-save-msg">
            For now this just logs GRN data to the browser console.
          </span>
        </div>
      </div>
    </div>
  );
}
/* ===================== Pos page =====================*/
function POSPage() {
  // Mock HSN + tax rates (same structure as PO)
  const hsnRates = [
    { code: "6105", description: "Men's cotton shirts", cgst: 2.5, sgst: 2.5, igst: 5.0 },
    { code: "6109", description: "T-shirts, singlets and vests", cgst: 2.5, sgst: 2.5, igst: 5.0 },
    { code: "6203", description: "Men's suits, jackets, trousers", cgst: 6.0, sgst: 6.0, igst: 12.0 },
  ];

  // Mock items (in real system, these will come from Item Master where status = Published)
  const itemOptions = [
    {
      id: 1,
      sku: "RR-SHIRT-001",
      name: "Slim Fit Cotton Shirt",
      hsnCode: "6105",
      rate: 1999,
    },
    {
      id: 2,
      sku: "RR-TSHIRT-002",
      name: "Graphic Tee",
      hsnCode: "6109",
      rate: 999,
    },
    {
      id: 3,
      sku: "RR-TROUSER-003",
      name: "Chino Trouser",
      hsnCode: "6203",
      rate: 2499,
    },
  ];

  const [billNumber, setBillNumber] = useState("BILL-0001");
  const [billDate, setBillDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [lines, setLines] = useState([
    {
      id: Date.now(),
      itemId: "",
      sku: "",
      description: "",
      hsnCode: "",
      qty: 1,
      rate: "",
    },
  ]);

  // Saved invoices (Sales Invoice table)
  const [invoices, setInvoices] = useState([]);

  const getHsnRates = (hsnCode) => {
    const h = hsnRates.find((x) => x.code === hsnCode);
    return (
      h || {
        code: "",
        description: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
      }
    );
  };

  const computeLineAmounts = (line) => {
    const { cgst, sgst, igst } = getHsnRates(line.hsnCode);
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const base = qty * rate;
    const cgstAmt = (base * cgst) / 100;
    const sgstAmt = (base * sgst) / 100;
    const igstAmt = (base * igst) / 100;
    const total = base + cgstAmt + sgstAmt + igstAmt;
    const taxTotal = cgstAmt + sgstAmt + igstAmt;
    return { base, taxTotal, cgstAmt, sgstAmt, igstAmt, total };
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        itemId: "",
        sku: "",
        description: "",
        hsnCode: "",
        qty: 1,
        rate: "",
      },
    ]);
  };

  const removeLine = (lineId) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  };

  const updateLineField = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSkuChange = (index, sku) => {
    const item = itemOptions.find((it) => it.sku === sku);
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        itemId: item ? item.id : "",
        sku: item ? item.sku : "",
        description: item ? item.name : "",
        hsnCode: item ? item.hsnCode : "",
        rate: item ? item.rate : "",
      };
      return copy;
    });
  };

  // Totals for bill
  const totals = lines.reduce(
    (acc, line) => {
      const { base, taxTotal, total } = computeLineAmounts(line);
      acc.subtotal += base;
      acc.tax += taxTotal;
      acc.grandTotal += total;
      return acc;
    },
    { subtotal: 0, tax: 0, grandTotal: 0 }
  );

  // Generate next bill number: BILL-0001 -> BILL-0002 etc.
  const getNextBillNumber = (current) => {
    const match = current.match(/(\d+)$/);
    if (!match) return current;
    const num = parseInt(match[1], 10) + 1;
    return `BILL-${String(num).padStart(4, "0")}`;
  };

  // New Bill button: save invoice to table, then reset form
  const handleNewBill = () => {
    // basic guard: don't save empty bills
    if (!lines.length || totals.grandTotal === 0) {
      alert("Nothing to save. Please add items to the bill.");
      return;
    }

    const invoice = {
      id: Date.now(),
      billNumber,
      billDate,
      customerName: customerName || "Walk-in",
      customerEmail,
      customerPhone,
      subtotal: totals.subtotal,
      tax: totals.tax,
      grandTotal: totals.grandTotal,
    };

    setInvoices((prev) => [...prev, invoice]);

    // Prepare for next bill
    setBillNumber((prev) => getNextBillNumber(prev));
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setLines([
      {
        id: Date.now(),
        itemId: "",
        sku: "",
        description: "",
        hsnCode: "",
        qty: 1,
        rate: "",
      },
    ]);
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>POS - Sale</h2>
        <p>
          Create sales invoices by adding SKUs to the cart. HSN-based GST is
          applied automatically. Clicking <strong>New Bill</strong> saves the
          invoice into the list below.
        </p>
      </div>

      <div className="rf-card rf-pos-layout">
        {/* LEFT: Cart / items */}
        <div className="rf-pos-left">
          {/* Bill header */}
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
              />
            </div>
          </div>

          {/* Cart table */}
          <div className="rf-table-header">
            <h3>Cart Items</h3>
            <button
              type="button"
              className="rf-primary-btn"
              onClick={addLine}
            >
              + Add Item
            </button>
          </div>

          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-pos">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Line Total (incl. GST)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const { total } = computeLineAmounts(line);

                  return (
                    <tr key={line.id}>
                      {/* SKU select */}
                      <td>
                        <select
                          className="rf-cell-select"
                          value={line.sku}
                          onChange={(e) =>
                            handleSkuChange(index, e.target.value)
                          }
                        >
                          <option value="">Select SKU</option>
                          {itemOptions.map((it) => (
                            <option key={it.id} value={it.sku}>
                              {it.sku}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Description */}
                      <td>{line.description || "-"}</td>

                      {/* Qty */}
                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.qty}
                          min="1"
                          onChange={(e) =>
                            updateLineField(index, "qty", e.target.value)
                          }
                        />
                      </td>

                      {/* Rate */}
                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.rate}
                          min="0"
                          onChange={(e) =>
                            updateLineField(index, "rate", e.target.value)
                          }
                        />
                      </td>

                      {/* Line total */}
                      <td>{total.toFixed(2)}</td>

                      {/* Remove */}
                      <td>
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => removeLine(line.id)}
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
        </div>

        {/* RIGHT: Customer + summary */}
        <div className="rf-pos-right">
          <div className="rf-pos-customer">
            <h3>Customer</h3>
            <div className="rf-input-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in"
              />
            </div>
            <div className="rf-input-group">
              <label>Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            <div className="rf-input-group">
              <label>Mobile</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile"
              />
            </div>
          </div>

          <div className="rf-pos-summary">
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

            <div className="rf-pos-actions">
              <button
                type="button"
                className="rf-primary-btn"
                onClick={handleNewBill}
              >
                New Bill
              </button>
            </div>

            <p className="rf-save-msg" style={{ marginTop: "6px" }}>
              Clicking <strong>New Bill</strong> saves the invoice in the table
              below and clears the form for the next sale.
            </p>
          </div>
        </div>
      </div>

      {/* Sales Invoice table (saved bills) */}
      {invoices.length > 0 && (
        <div className="rf-pos-invoices">
          <h3>Saved Bills (Current Session)</h3>
          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-pos-invoices">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.billNumber}</td>
                    <td>{inv.billDate}</td>
                    <td>{inv.customerName}</td>
                    <td>{inv.customerEmail || "-"}</td>
                    <td>{inv.customerPhone || "-"}</td>
                    <td>₹ {inv.grandTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
/*==========================Login========================*/
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin(username.trim(), password);
    if (!result.success) {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="rf-login-wrapper">
      <div className="rf-login-card">
        <h1 className="rf-login-title">RetailFlow</h1>
        <p className="rf-login-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="rf-login-form">
          <div className="rf-input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin / store / inventory / sales"
            />
          </div>

          <div className="rf-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. admin123"
            />
          </div>

          {error && <div className="rf-login-error">{error}</div>}

          <button type="submit" className="rf-primary-btn rf-login-btn">
            Log In
          </button>

          <div className="rf-login-hint">
            Demo users:
            <br />
            admin / admin123 (Admin)
            <br />
            store / store123 (Store Manager)
            <br />
            inventory / inv123 (Inventory Manager)
            <br />
            sales / sales123 (Sales Manager)
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
