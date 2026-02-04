import { useState } from "react";

/* ===================== Retailer Profile Page ===================== */
/* Front-end only, hard-coded */

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

export default function RetailerProfilePage() {
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
    // No backend – fake save
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage(
        "Retailer profile updated locally (not saved to server)."
      );
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
            />
          </div>

          <div className="rf-input-group rf-input-wide">
            <label>Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={handleChange("address")}
            />
          </div>

          <div className="rf-form-grid">
            <div className="rf-input-group">
              <label>City</label>
              <input
                type="text"
                value={form.city}
                onChange={handleChange("city")}
              />
            </div>

            <div className="rf-input-group">
              <label>State</label>
              <input
                type="text"
                value={form.state}
                onChange={handleChange("state")}
              />
            </div>

            <div className="rf-input-group">
              <label>Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={handleChange("pincode")}
              />
            </div>

            <div className="rf-input-group">
              <label>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>

            <div className="rf-input-group">
              <label>Email</label>
              <input
                type="text"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>

            <div className="rf-input-group">
              <label>PAN</label>
              <input
                type="text"
                value={form.pan}
                onChange={handleChange("pan")}
              />
            </div>

            <div className="rf-input-group rf-input-wide">
              <label>GSTIN</label>
              <input
                type="text"
                value={form.gstin}
                onChange={handleChange("gstin")}
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