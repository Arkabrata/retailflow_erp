// src/App.jsx
import { useState } from "react";
import "./App.css";

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

/* ===================== Item Master Page ===================== */

function ItemMasterPage() {
  // In real app, this will come from HSN Master API / DB
  const hsnOptions = [
    { code: "6105", description: "Men's cotton shirts" },
    { code: "6109", description: "T-shirts, singlets and vests" },
    { code: "6203", description: "Men's suits, jackets, trousers" },
  ];

  const [items, setItems] = useState([
    {
      id: 1,
      sku: "RR-SHIRT-001",
      brand: "Rare Rabbit",
      division: "Menswear",
      category: "Shirts",
      subCategory: "Casual",
      style: "Slim Fit",
      color: "Navy",
      size: "M",
      hsnCode: "6105",   // NEW: linked to HSN
      imageFile: null,
      imagePreview: "",
      status: "Published",
    },
  ]);

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        sku: "",
        brand: "",
        division: "",
        category: "",
        subCategory: "",
        style: "",
        color: "",
        size: "",
        hsnCode: "",      // NEW FIELD
        imageFile: null,
        imagePreview: "",
        status: "Draft",
      },
    ]);
  };

  const updateField = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        imageFile: file,
        imagePreview: previewUrl,
      };
      return copy;
    });
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Item Master</h2>
        <p>
          Maintain SKU-level details (Brand, Division, Category, Sub Category,
          Style, Color, Size, HSN, Image). Only items with status &quot;Published&quot; 
          will later be used for POS billing.
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
                <th>HSN</th>      {/* NEW COLUMN */}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, index) => (
                <tr key={it.id}>
                  {/* Image upload */}
                  <td>
                    <label className="rf-upload-thumb">
                      {it.imagePreview ? (
                        <img
                          src={it.imagePreview}
                          alt={it.sku || "item"}
                          className="rf-item-image"
                        />
                      ) : (
                        <span className="rf-upload-placeholder">Upload</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(index, e)}
                      />
                    </label>
                  </td>

                  {/* Editable text cells */}
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.sku}
                      onChange={(e) => updateField(index, "sku", e.target.value)}
                      placeholder="RR-SHIRT-001"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.brand}
                      onChange={(e) =>
                        updateField(index, "brand", e.target.value)
                      }
                      placeholder="Rare Rabbit"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.division}
                      onChange={(e) =>
                        updateField(index, "division", e.target.value)
                      }
                      placeholder="Menswear"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.category}
                      onChange={(e) =>
                        updateField(index, "category", e.target.value)
                      }
                      placeholder="Shirts"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.subCategory}
                      onChange={(e) =>
                        updateField(index, "subCategory", e.target.value)
                      }
                      placeholder="Casual"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.style}
                      onChange={(e) =>
                        updateField(index, "style", e.target.value)
                      }
                      placeholder="Slim Fit"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.color}
                      onChange={(e) =>
                        updateField(index, "color", e.target.value)
                      }
                      placeholder="Navy"
                    />
                  </td>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={it.size}
                      onChange={(e) =>
                        updateField(index, "size", e.target.value)
                      }
                      placeholder="M"
                    />
                  </td>

                  {/* NEW: HSN dropdown */}
                  <td>
                    <select
                      className="rf-cell-select"
                      value={it.hsnCode}
                      onChange={(e) =>
                        updateField(index, "hsnCode", e.target.value)
                      }
                    >
                      <option value="">Select HSN</option>
                      {hsnOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.code} – {opt.description}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Publish / Draft */}
                  <td>
                    <select
                      className="rf-cell-select"
                      value={it.status}
                      onChange={(e) =>
                        updateField(index, "status", e.target.value)
                      }
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rf-table-footnote">
          Note: HSN is selected per SKU. When we build the PO module, tax (CGST,
          SGST, IGST) will be picked from the HSN Master based on this value.
        </p>
      </div>
    </div>
  );
}

/* ===================== Retailer Profile Page ===================== */

function RetailerProfilePage() {
  const [retailer, setRetailer] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pan: "",
    gst: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRetailer((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: later send to backend
    setSaved(true);
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Retailer Profile</h2>
        <p>
          Store details used on POS bills, exports, and reports. Fill once and
          reuse across the system.
        </p>
      </div>

      <div className="rf-card rf-card-wide">
        {/* FORM */}
        <form className="rf-form" onSubmit={handleSubmit}>
          <div className="rf-form-grid">
            <div className="rf-input-group rf-input-wide">
              <label>Retailer / Store Name</label>
              <input
                type="text"
                name="name"
                value={retailer.name}
                onChange={handleChange}
                placeholder="Rare Rabbit - MG Road"
              />
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>Address</label>
              <textarea
                name="address"
                value={retailer.address}
                onChange={handleChange}
                rows={3}
                placeholder="Door no, Street, Area"
              />
            </div>

            <div className="rf-input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={retailer.city}
                onChange={handleChange}
                placeholder="Bengaluru"
              />
            </div>

            <div className="rf-input-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={retailer.state}
                onChange={handleChange}
                placeholder="Karnataka"
              />
            </div>

            <div className="rf-input-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={retailer.pincode}
                onChange={handleChange}
                placeholder="560001"
              />
            </div>

            <div className="rf-input-group">
              <label>PAN</label>
              <input
                type="text"
                name="pan"
                value={retailer.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="rf-input-group">
              <label>GSTIN</label>
              <input
                type="text"
                name="gst"
                value={retailer.gst}
                onChange={handleChange}
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
          </div>

          <div className="rf-form-actions">
            <button type="submit" className="rf-primary-btn">
              Save Retailer Profile
            </button>
            {saved && (
              <span className="rf-save-msg">
                Saved (current session only – backend to be added later).
              </span>
            )}
          </div>
        </form>

        {/* PREVIEW */}
        <div className="rf-summary-block">
          <h3>Preview</h3>
          <div className="rf-summary-card">
            <div className="rf-summary-name">
              {retailer.name || "Store Name"}
            </div>
            <div className="rf-summary-line">
              {retailer.address || "Address line"}
            </div>
            <div className="rf-summary-line">
              {(retailer.city || "City") +
                ", " +
                (retailer.state || "State") +
                " - " +
                (retailer.pincode || "PIN")}
            </div>
            <div className="rf-summary-line">
              PAN: {retailer.pan || "XXXXXXXXXX"}
            </div>
            <div className="rf-summary-line">
              GSTIN: {retailer.gst || "XXXXXXXXXXXXXXX"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== User Management Page ===================== */

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

/* ===================== Vendor Master Page ===================== */

function VendorMasterPage() {
  // In real app, these would come from Item Master / backend
  const skuOptions = [
    {
      value: "RR-SHIRT-001",
      label: "RR-SHIRT-001 – Rare Rabbit Slim Fit Shirt",
    },
    {
      value: "RR-TSHIRT-002",
      label: "RR-TSHIRT-002 – Graphic Tee",
    },
    {
      value: "RR-TROUSER-003",
      label: "RR-TROUSER-003 – Chino Trouser",
    },
  ];

  const [vendors, setVendors] = useState([
    {
      id: 1,
      code: "V0001",
      name: "ABC Traders",
      address: "No 12, MG Road, Bengaluru",
      email: "contact@abctraders.com",
      phone: "9876543210",
      skus: ["RR-SHIRT-001"],
      status: "Active",
      isEditing: false,
    },
  ]);

  const getNextVendorCode = () => {
    if (vendors.length === 0) return "V0001";
    const nums = vendors
      .map((v) => parseInt(String(v.code).replace("V", ""), 10))
      .filter((n) => !Number.isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    const next = max + 1;
    return `V${String(next).padStart(4, "0")}`;
  };

  const handleAddVendor = () => {
    const newVendor = {
      id: Date.now(),
      code: getNextVendorCode(),
      name: "",
      address: "",
      email: "",
      phone: "",
      skus: [],
      status: "Active",
      isEditing: true,
    };
    setVendors((prev) => [...prev, newVendor]);
  };

  const updateVendorField = (index, field, value) => {
    setVendors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSkuChange = (index, event) => {
    const selected = Array.from(event.target.selectedOptions).map(
      (opt) => opt.value
    );
    updateVendorField(index, "skus", selected);
  };

  const toggleEdit = (index) => {
    updateVendorField(index, "isEditing", true);
  };

  const saveVendor = (index) => {
    updateVendorField(index, "isEditing", false);
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Vendor Master</h2>
        <p>
          Maintain vendor records with contact details and linked SKUs from Item
          Master. Only <strong>Active</strong> vendors will be considered for
          future purchase workflows.
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
              {vendors.map((v, index) => (
                <tr key={v.id}>
                  <td>{v.code}</td>

                  {/* Name */}
                  <td>
                    {v.isEditing ? (
                      <input
                        className="rf-cell-input"
                        value={v.name}
                        onChange={(e) =>
                          updateVendorField(index, "name", e.target.value)
                        }
                        placeholder="ABC Traders"
                      />
                    ) : (
                      v.name || "-"
                    )}
                  </td>

                  {/* Address */}
                  <td>
                    {v.isEditing ? (
                      <input
                        className="rf-cell-input"
                        value={v.address}
                        onChange={(e) =>
                          updateVendorField(index, "address", e.target.value)
                        }
                        placeholder="Address"
                      />
                    ) : (
                      v.address || "-"
                    )}
                  </td>

                  {/* Email */}
                  <td>
                    {v.isEditing ? (
                      <input
                        className="rf-cell-input"
                        value={v.email}
                        onChange={(e) =>
                          updateVendorField(index, "email", e.target.value)
                        }
                        placeholder="vendor@email.com"
                      />
                    ) : (
                      v.email || "-"
                    )}
                  </td>

                  {/* Phone */}
                  <td>
                    {v.isEditing ? (
                      <input
                        className="rf-cell-input"
                        value={v.phone}
                        onChange={(e) =>
                          updateVendorField(index, "phone", e.target.value)
                        }
                        placeholder="9876543210"
                      />
                    ) : (
                      v.phone || "-"
                    )}
                  </td>

                  {/* SKUs */}
                  <td>
                    {v.isEditing ? (
                      <select
                        multiple
                        className="rf-sku-multiselect"
                        value={v.skus}
                        onChange={(e) => handleSkuChange(index, e)}
                      >
                        {skuOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="rf-sku-chips">
                        {v.skus.length ? (
                          v.skus.map((sku) => (
                            <span key={sku} className="rf-sku-chip">
                              {sku}
                            </span>
                          ))
                        ) : (
                          <span className="rf-sku-empty">No SKUs</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <select
                      className="rf-cell-select"
                      value={v.status}
                      onChange={(e) =>
                        updateVendorField(index, "status", e.target.value)
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="rf-table-actions">
                      {v.isEditing ? (
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => saveVendor(index)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => toggleEdit(index)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rf-table-footnote">
          Note: SKU list is mocked for now. In the final version, these SKUs
          will be pulled from Item Master / database.
        </p>
      </div>
    </div>
  );
}
/* ===================== HSN Master Page ===================== */
function HSNMasterPage() {
  const [rows, setRows] = useState([
    {
      id: 1,
      code: "6105",
      description: "Men's cotton shirts",
      cgst: 2.5,
      sgst: 2.5,
      igst: 5.0,
    },
  ]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        code: "",
        description: "",
        cgst: "",
        sgst: "",
        igst: "",
      },
    ]);
  };

  const updateField = (index, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>HSN Master</h2>
        <p>
          Maintain HSN codes and tax split (CGST, SGST, IGST).  
          Item Master and PO will use these values.
        </p>
      </div>

      <div className="rf-card">
        <div className="rf-table-header">
          <h3>HSN Codes</h3>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={handleAddRow}
          >
            + Add HSN
          </button>
        </div>

        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-hsn">
            <thead>
              <tr>
                <th>HSN Code</th>
                <th>Description</th>
                <th>CGST %</th>
                <th>SGST %</th>
                <th>IGST %</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input
                      className="rf-cell-input"
                      value={row.code}
                      onChange={(e) =>
                        updateField(index, "code", e.target.value)
                      }
                      placeholder="6105"
                    />
                  </td>

                  <td>
                    <input
                      className="rf-cell-input"
                      value={row.description}
                      onChange={(e) =>
                        updateField(index, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="rf-cell-input rf-tax-input"
                      value={row.cgst}
                      onChange={(e) =>
                        updateField(index, "cgst", e.target.value)
                      }
                      placeholder="0"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="rf-cell-input rf-tax-input"
                      value={row.sgst}
                      onChange={(e) =>
                        updateField(index, "sgst", e.target.value)
                      }
                      placeholder="0"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="rf-cell-input rf-tax-input"
                      value={row.igst}
                      onChange={(e) =>
                        updateField(index, "igst", e.target.value)
                      }
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="rf-table-footnote">
          Item Master & Purchase Orders will use these tax rates.
        </p>
      </div>
    </div>
  );
}
/* ===================== Purchase Order Page ===================== */
function PurchaseOrderPage() {
  // Mock HSN data (this should mirror your HSN Master later from DB)
  const hsnRates = [
    { code: "6105", description: "Men's cotton shirts", cgst: 2.5, sgst: 2.5, igst: 5.0 },
    { code: "6109", description: "T-shirts, singlets and vests", cgst: 2.5, sgst: 2.5, igst: 5.0 },
    { code: "6203", description: "Men's suits, jackets, trousers", cgst: 6.0, sgst: 6.0, igst: 12.0 },
  ];

  // Mock items (simulating Item Master)
  const itemOptions = [
    {
      id: 1,
      sku: "RR-SHIRT-001",
      name: "Slim Fit Cotton Shirt",
      hsnCode: "6105",
    },
    {
      id: 2,
      sku: "RR-TSHIRT-002",
      name: "Graphic Tee",
      hsnCode: "6109",
    },
    {
      id: 3,
      sku: "RR-TROUSER-003",
      name: "Chino Trouser",
      hsnCode: "6203",
    },
  ];

  // Mock vendors (from Vendor Master in future)
  const vendorOptions = [
    { id: 1, name: "ABC Traders" },
    { id: 2, name: "XYZ Fabrics" },
    { id: 3, name: "Urban Styles Ltd" },
  ];

  const [poNumber] = useState("PO0001"); // later: auto-generate
  const [poDate, setPoDate] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState("Draft");

  const [lines, setLines] = useState([
    {
      id: Date.now(),
      itemId: "",
      sku: "",
      description: "",
      hsnCode: "",
      qty: "",
      rate: "",
    },
  ]);

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
    return { base, cgst, sgst, igst, cgstAmt, sgstAmt, igstAmt, total };
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
        qty: "",
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
      };
      return copy;
    });
  };

  // Compute totals for PO
  const totals = lines.reduce(
    (acc, line) => {
      const { base, cgstAmt, sgstAmt, igstAmt, total } = computeLineAmounts(
        line
      );
      acc.subtotal += base;
      acc.cgst += cgstAmt;
      acc.sgst += sgstAmt;
      acc.igst += igstAmt;
      acc.grandTotal += total;
      return acc;
    },
    { subtotal: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 0 }
  );

  const handleSavePo = () => {
    // For now just console.log; later send to backend
    console.log("PO Saved (mock):", {
      poNumber,
      poDate,
      vendorId,
      status,
      lines,
    });
    alert("PO data logged to console (mock save).");
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>Purchase Order</h2>
        <p>
          Create a PO by selecting Vendor, SKUs, quantity, rate and auto-apply
          tax from HSN Master (CGST, SGST, IGST).
        </p>
      </div>

      <div className="rf-card">
        {/* PO Header */}
        <div className="rf-po-header-grid">
          <div className="rf-input-group">
            <label>PO Number</label>
            <input type="text" value={poNumber} disabled />
          </div>

          <div className="rf-input-group">
            <label>PO Date</label>
            <input
              type="date"
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
            />
          </div>

          <div className="rf-input-group">
            <label>Vendor</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
            >
              <option value="">Select Vendor</option>
              {vendorOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rf-input-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Draft">Draft</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Line items table */}
        <div className="rf-table-header">
          <h3>Line Items</h3>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={addLine}
          >
            + Add Line
          </button>
        </div>

        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-po">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Base Amt</th>
                <th>CGST %</th>
                <th>CGST Amt</th>
                <th>SGST %</th>
                <th>SGST Amt</th>
                <th>IGST %</th>
                <th>IGST Amt</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => {
                const {
                  base,
                  cgst,
                  sgst,
                  igst,
                  cgstAmt,
                  sgstAmt,
                  igstAmt,
                  total,
                } = computeLineAmounts(line);

                const hsnRateRow = getHsnRates(line.hsnCode);

                return (
                  <tr key={line.id}>
                    {/* SKU */}
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

                    {/* HSN */}
                    <td>{line.hsnCode || "-"}</td>

                    {/* Qty */}
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input rf-po-number-input"
                        value={line.qty}
                        onChange={(e) =>
                          updateLineField(index, "qty", e.target.value)
                        }
                        min="0"
                      />
                    </td>

                    {/* Rate */}
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input rf-po-number-input"
                        value={line.rate}
                        onChange={(e) =>
                          updateLineField(index, "rate", e.target.value)
                        }
                        min="0"
                      />
                    </td>

                    {/* Base amount */}
                    <td>{base.toFixed(2)}</td>

                    {/* CGST */}
                    <td>{hsnRateRow.cgst}</td>
                    <td>{cgstAmt.toFixed(2)}</td>

                    {/* SGST */}
                    <td>{hsnRateRow.sgst}</td>
                    <td>{sgstAmt.toFixed(2)}</td>

                    {/* IGST */}
                    <td>{hsnRateRow.igst}</td>
                    <td>{igstAmt.toFixed(2)}</td>

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

        {/* PO totals */}
        <div className="rf-po-summary">
          <div className="rf-po-summary-row">
            <span>Subtotal</span>
            <span>₹ {totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="rf-po-summary-row">
            <span>CGST</span>
            <span>₹ {totals.cgst.toFixed(2)}</span>
          </div>
          <div className="rf-po-summary-row">
            <span>SGST</span>
            <span>₹ {totals.sgst.toFixed(2)}</span>
          </div>
          <div className="rf-po-summary-row">
            <span>IGST</span>
            <span>₹ {totals.igst.toFixed(2)}</span>
          </div>
          <div className="rf-po-summary-row rf-po-summary-total">
            <span>Grand Total</span>
            <span>₹ {totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="rf-form-actions" style={{ marginTop: "16px" }}>
          <button
            type="button"
            className="rf-primary-btn"
            onClick={handleSavePo}
          >
            Save PO (Mock)
          </button>
          <span className="rf-save-msg">
            For now this just logs to console. Later we will save to DB.
          </span>
        </div>
      </div>
    </div>
  );
}
/* ===================== GRN Page ===================== */
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
/* ===================== Pos page ===================== */
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
