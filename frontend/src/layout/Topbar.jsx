export default function Topbar({ currentUser, onToggleSidebar, onLogout }) {
  const name = currentUser?.name || "User";
  const role = currentUser?.role || "Retail User"; // optional if you have it

  return (
    <header className="rf-topbar rf-topbar-erp">
      <button className="rf-menu-button" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
        ☰
      </button>

      <div className="rf-topbar-brand">
        <div className="rf-topbar-title">RetailFlow</div>
        <div className="rf-topbar-subtitle">Inventory Manager</div>
      </div>

      <div className="rf-topbar-spacer" />

      {/* Right side */}
      <div className="rf-topbar-right">
        <div className="rf-userchip" title={role}>
          <div className="rf-userchip-avatar">{name?.slice(0, 1)?.toUpperCase()}</div>
          <div className="rf-userchip-meta">
            <div className="rf-userchip-name">{name}</div>
            <div className="rf-userchip-role">{role}</div>
          </div>
        </div>

        <button className="rf-secondary-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
