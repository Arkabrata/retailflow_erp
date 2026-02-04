import { useState } from "react";

export default function LoginScreen({ onLogin }) {
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
