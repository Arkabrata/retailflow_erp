import { useState } from "react";

/* ===================== GRN Page ===================== */

export default function GRNPage() {
  // Mock vendors
  const vendorOptions = [
    { id: 1, name: "ABC Traders" },
    { id: 2, name: "XYZ Fabrics" },
  ];

  // Mock POs with lines (later comes from Purchase Orders table)
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
  const [grnDate, setGrnDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedPoId, setSelectedPoId] = useState("");
  const [lines, setLines] = useState([]);

  const selectedPo = poList.find(
    (p) => String(p.id) === String(selectedPoId)
  );

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
      receivedQty: ln.orderedQty,
      acceptedQty: ln.orderedQty,
      rejectedQty: 0,
    }));

    setLines(initialLines);
  };

  const updateLineField = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: Number(value) || 0,
      };
      return copy;
    });
  };

  const totals = lines.reduce(
    (acc, ln) => {
      acc.ordered += ln.orderedQty || 0;
      acc.received += ln.receivedQty || 0;
      acc.accepted += ln.acceptedQty || 0;
      acc.rejected += ln.rejectedQty || 0;
      return acc;
    },
    { ordered: 0, received: 0, accepted: 0, rejected: 0 }
  );

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
        {/* Header */}
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
                  {po.number}
                </option>
              ))}
            </select>
          </div>

          <div className="rf-input-group">
            <label>Vendor</label>
            <input
              type="text"
              value={vendorForPo?.name || ""}
              disabled
              placeholder="Auto from PO"
            />
          </div>
        </div>

        {/* Lines */}
        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-grn">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Ordered</th>
                <th>Received</th>
                <th>Accepted</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>
                    Select a PO to load items.
                  </td>
                </tr>
              ) : (
                lines.map((ln, idx) => (
                  <tr key={ln.id}>
                    <td>{ln.sku}</td>
                    <td>{ln.description}</td>
                    <td>{ln.orderedQty}</td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={ln.receivedQty}
                        onChange={(e) =>
                          updateLineField(idx, "receivedQty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={ln.acceptedQty}
                        onChange={(e) =>
                          updateLineField(idx, "acceptedQty", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="rf-cell-input"
                        value={ln.rejectedQty}
                        onChange={(e) =>
                          updateLineField(idx, "rejectedQty", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="rf-grn-summary">
          <div>Ordered: {totals.ordered}</div>
          <div>Received: {totals.received}</div>
          <div>Accepted: {totals.accepted}</div>
          <div>Rejected: {totals.rejected}</div>
        </div>

        <div className="rf-form-actions">
          <button
            className="rf-primary-btn"
            onClick={handleSaveGrn}
            disabled={!selectedPoId}
          >
            Save GRN (Mock)
          </button>
        </div>
      </div>
    </div>
  );
}