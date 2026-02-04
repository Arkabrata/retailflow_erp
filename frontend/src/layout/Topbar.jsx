export default function Topbar({ currentUser, onToggleSidebar, onLogout }) {
  return (
    <header className="rf-topbar">
      <button className="rf-menu-button" onClick={onToggleSidebar}>
        ☰
      </button>

      <div className="rf-topbar-title">RetailFlow</div>

      <div style={{ marginLeft: "auto", display: "flex", gap: "14px" }}>
        <span className="rf-topbar-user">
          {currentUser?.name || "User"}
        </span>
        <button className="rf-text-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}