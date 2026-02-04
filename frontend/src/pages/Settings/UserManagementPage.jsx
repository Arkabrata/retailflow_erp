import { useState } from "react";

/* ===================== User Management Page ===================== */
/* Front-end only (browser state) */

export default function UserManagementPage() {
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
          Admin. These roles control access to different parts of RetailFlow.
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