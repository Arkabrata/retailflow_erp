// src/layout/Sidebar.jsx
const NAV = [
  {
    title: "Operations",
    items: [
      { key: "pos", label: "POS", icon: "🧾" },
      { key: "inventory", label: "Inventory", icon: "📦" },
    ],
  },
  {
    title: "Masters",
    items: [
      { key: "itemMaster", label: "Item Master", icon: "🏷️" },
      { key: "hsnMaster", label: "HSN Master", icon: "🧾" },
      { key: "vendorMaster", label: "Vendor Master", icon: "🏢" },
    ],
  },
  {
    title: "Procurement",
    items: [
      { key: "purchaseOrders", label: "Purchase Orders", icon: "📝" },
      { key: "grn", label: "GRN", icon: "✅" },
    ],
  },
  {
    title: "Administration",
    items: [
      { key: "retailerProfile", label: "Retailer Profile", icon: "⚙️" },
      { key: "users", label: "Users", icon: "👤" },
    ],
  },
  {
    title: "Analytics",
    items: [{ key: "analytics", label: "Analytics", icon: "📈" }],
  },
];

export default function Sidebar({ collapsed, active, onNavigate }) {
  const itemClass = (key) =>
    `rf-sidebar-item ${active === key ? "rf-sidebar-item-active" : ""}`;

  return (
    <aside className={`rf-sidebar rf-sidebar-erp ${collapsed ? "rf-sidebar-collapsed" : ""}`}>
      <div className="rf-sidebar-brand">
        <div className="rf-sidebar-logo">RF</div>
        {!collapsed && (
          <div className="rf-sidebar-brandtext">
            <div className="rf-sidebar-brandname">RetailFlow</div>
            <div className="rf-sidebar-brandsub">ERP Console</div>
          </div>
        )}
      </div>

      <nav className="rf-sidebar-nav rf-sidebar-nav-erp">
        {NAV.map((group) => (
          <div key={group.title} className="rf-sidebar-group">
            {!collapsed && <div className="rf-sidebar-group-title">{group.title}</div>}

            <div className="rf-sidebar-group-items">
              {group.items.map((it) => (
                <button
                  key={it.key}
                  className={itemClass(it.key)}
                  onClick={() => onNavigate(it.key)}
                  title={collapsed ? it.label : ""}
                >
                  <span className="rf-sidebar-icon" aria-hidden="true">
                    {it.icon}
                  </span>
                  {!collapsed && <span className="rf-sidebar-label">{it.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="rf-sidebar-footer">
          <div className="rf-sidebar-footer-hint">v2.0 • Sprint-2</div>
        </div>
      )}
    </aside>
  );
}
