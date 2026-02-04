// src/layout/Sidebar.jsx
export default function Sidebar({ collapsed, active, onNavigate }) {
  const item = (key) =>
    `rf-sidebar-item ${active === key ? "rf-sidebar-item-active" : ""}`;

  return (
    <aside className={`rf-sidebar ${collapsed ? "rf-sidebar-collapsed" : ""}`}>
      <nav className="rf-sidebar-nav">
        <button className={item("pos")} onClick={() => onNavigate("pos")}>
          POS
        </button>

        <button
          className={item("itemMaster")}
          onClick={() => onNavigate("itemMaster")}
        >
          Item Master
        </button>

        <button
          className={item("hsnMaster")}
          onClick={() => onNavigate("hsnMaster")}
        >
          HSN Master
        </button>

        <button
          className={item("vendorMaster")}
          onClick={() => onNavigate("vendorMaster")}
        >
          Vendor Master
        </button>

        <button
          className={item("purchaseOrders")}
          onClick={() => onNavigate("purchaseOrders")}
        >
          Purchase Orders
        </button>

        <button className={item("grn")} onClick={() => onNavigate("grn")}>
          GRN
        </button>

        <button
          className={item("retailerProfile")}
          onClick={() => onNavigate("retailerProfile")}
        >
          Retailer Profile
        </button>

        <button className={item("users")} onClick={() => onNavigate("users")}>
          Users
        </button>

        <button
          className={item("analytics")}
          onClick={() => onNavigate("analytics")}
        >
          Analytics
        </button>
      </nav>
    </aside>
  );
}