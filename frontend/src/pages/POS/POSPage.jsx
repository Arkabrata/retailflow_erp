// src/pages/POS/POSPage.jsx
import { useMemo, useState } from "react";

export default function POSPage() {
  // Mock HSN + tax rates (same structure as PO)
  const hsnRates = [
    {
      code: "6105",
      description: "Men's cotton shirts",
      cgst: 2.5,
      sgst: 2.5,
      igst: 5.0,
    },
    {
      code: "6109",
      description: "T-shirts, singlets and vests",
      cgst: 2.5,
      sgst: 2.5,
      igst: 5.0,
    },
    {
      code: "6203",
      description: "Men's suits, jackets, trousers",
      cgst: 6.0,
      sgst: 6.0,
      igst: 12.0,
    },
  ];

  // Mock items (in real system, these will come from Item Master where status = Published)
  const itemOptions = [
    { id: 1, sku: "RR-SHIRT-001", name: "Slim Fit Cotton Shirt", hsnCode: "6105", rate: 1999 },
    { id: 2, sku: "RR-TSHIRT-002", name: "Graphic Tee", hsnCode: "6109", rate: 999 },
    { id: 3, sku: "RR-TROUSER-003", name: "Chino Trouser", hsnCode: "6203", rate: 2499 },
  ];

  const [billNumber, setBillNumber] = useState("BILL-0001");
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const makeEmptyLine = () => ({
    id: Date.now() + Math.random(),
    sku: "",
    description: "",
    hsnCode: "",
    qty: 1,
    rate: 0,
  });

  const [lines, setLines] = useState([makeEmptyLine()]);
  const [invoices, setInvoices] = useState([]);
  const [msg, setMsg] = useState("");

  const getHsnRates = (hsnCode) => {
    const h = hsnRates.find((x) => x.code === hsnCode);
    return h || { cgst: 0, sgst: 0, igst: 0 };
  };

  const computeLine = (line) => {
    const qty = Number(line.qty) || 0;
    const rate = Number(line.rate) || 0;
    const base = qty * rate;

    const { cgst, sgst, igst } = getHsnRates(line.hsnCode);
    const cgstAmt = (base * (Number(cgst) || 0)) / 100;
    const sgstAmt = (base * (Number(sgst) || 0)) / 100;
    const igstAmt = (base * (Number(igst) || 0)) / 100;

    const tax = cgstAmt + sgstAmt + igstAmt;
    const total = base + tax;

    return { base, tax, total };
  };

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        const { base, tax, total } = computeLine(line);
        acc.subtotal += base;
        acc.tax += tax;
        acc.grandTotal += total;
        return acc;
      },
      { subtotal: 0, tax: 0, grandTotal: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  const addLine = () => {
    setLines((prev) => [...prev, makeEmptyLine()]);
    setMsg("");
  };

  const removeLine = (lineId) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== lineId)));
    setMsg("");
  };

  const updateLineField = (index, field, value) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setMsg("");
  };

  const handleSkuChange = (index, sku) => {
    const item = itemOptions.find((it) => it.sku === sku);

    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        sku: item ? item.sku : "",
        description: item ? item.name : "",
        hsnCode: item ? item.hsnCode : "",
        rate: item ? item.rate : 0,
      };
      return copy;
    });

    setMsg("");
  };

  const getNextBillNumber = (current) => {
    const match = current.match(/(\d+)$/);
    if (!match) return current;
    const num = parseInt(match[1], 10) + 1;
    return `BILL-${String(num).padStart(4, "0")}`;
  };

  const handleNewBill = () => {
    const validLines = lines.filter((l) => l.sku && (Number(l.qty) || 0) > 0);
    if (!validLines.length || totals.grandTotal <= 0) {
      setMsg("Add at least 1 SKU to create a bill.");
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
      lineCount: validLines.length,
    };

    setInvoices((prev) => [invoice, ...prev]);

    // Reset for next bill
    setBillNumber((prev) => getNextBillNumber(prev));
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setLines([makeEmptyLine()]);
    setMsg("Bill saved (session). Ready for next bill.");
  };

  return (
    <div className="rf-page">
      <div className="rf-page-header">
        <h2>POS - Sale</h2>
        <p>Create sales invoices by adding SKUs. GST is applied from HSN rates.</p>
      </div>

      <div className="rf-card rf-pos-layout">
        {/* LEFT */}
        <div className="rf-pos-left">
          <div className="rf-pos-header-grid">
            <div className="rf-input-group">
              <label>Bill No.</label>
              <input type="text" value={billNumber} disabled />
            </div>
            <div className="rf-input-group">
              <label>Date</label>
              <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
            </div>
          </div>

          <div className="rf-table-header" style={{ marginTop: 12 }}>
            <h3>Cart Items</h3>
            <button type="button" className="rf-primary-btn" onClick={addLine}>
              + Add Item
            </button>
          </div>

          <div className="rf-table-wrapper">
            <table className="rf-table rf-table-pos">
              <thead>
                <tr>
                  <th style={{ width: 220 }}>SKU</th>
                  <th>Description</th>
                  <th style={{ width: 90 }}>Qty</th>
                  <th style={{ width: 110 }}>Rate</th>
                  <th style={{ width: 150, textAlign: "right" }}>Line Total</th>
                  <th style={{ width: 90 }} />
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => {
                  const { total } = computeLine(line);

                  return (
                    <tr key={line.id}>
                      <td>
                        <select
                          className="rf-cell-select"
                          value={line.sku}
                          onChange={(e) => handleSkuChange(index, e.target.value)}
                        >
                          <option value="">Select SKU</option>
                          {itemOptions.map((it) => (
                            <option key={it.id} value={it.sku}>
                              {it.sku}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td style={{ color: "#111827" }}>{line.description || "-"}</td>

                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.qty}
                          min="1"
                          onChange={(e) => updateLineField(index, "qty", e.target.value)}
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          className="rf-cell-input rf-pos-number-input"
                          value={line.rate}
                          min="0"
                          onChange={(e) => updateLineField(index, "rate", e.target.value)}
                        />
                      </td>

                      <td style={{ textAlign: "right" }}>{total.toFixed(2)}</td>

                      <td>
                        <button
                          type="button"
                          className="rf-text-button"
                          onClick={() => removeLine(line.id)}
                          disabled={lines.length <= 1}
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

          {msg && (
            <p style={{ marginTop: 10, fontSize: 12, color: "#16a34a" }}>
              {msg}
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="rf-pos-right">
          <div className="rf-pos-panel">
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

          <div className="rf-pos-panel">
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

            <button type="button" className="rf-primary-btn" style={{ marginTop: 10, width: "100%" }} onClick={handleNewBill}>
              New Bill
            </button>

            <p className="rf-table-footnote" style={{ marginTop: 8 }}>
              Saves in-session only (for now).
            </p>
          </div>
        </div>
      </div>

      {/* Saved invoices */}
      <div className="rf-card" style={{ marginTop: 18 }}>
        <div className="rf-table-header">
          <h3>Saved Bills (Current Session)</h3>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {invoices.length} bills
          </div>
        </div>

        <div className="rf-table-wrapper">
          <table className="rf-table rf-table-pos-invoices">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ textAlign: "right" }}>Lines</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ fontSize: 13, color: "#6b7280" }}>
                    No bills yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.billNumber}</td>
                    <td>{inv.billDate}</td>
                    <td>{inv.customerName}</td>
                    <td>{inv.customerPhone || "-"}</td>
                    <td style={{ textAlign: "right" }}>₹ {inv.grandTotal.toFixed(2)}</td>
                    <td style={{ textAlign: "right" }}>{inv.lineCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}