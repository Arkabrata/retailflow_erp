// frontend/src/pages/Analytics/AnalyticsHome.jsx
import { useMemo, useState } from "react";

/**
 * RetailFlow Sprint-2 Analytics (Frontend-only, Dummy Data)
 * Charts: Line (MoM + YoY), Bar (customers + segments), Cohort heatmap table
 * Range: Sales ₹10L–₹60L
 */

const INR = (n) => {
  // n is in INR
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const pct = (x) => `${Math.round(x * 100)}%`;

/* ---------- SVG CHARTS (No external libs) ---------- */

function LineChart({
  width = 720,
  height = 220,
  series, // [{name, data:[{x,label,value}], dashed?, stroke?}]
  yMin,
  yMax,
  yTicks = 5,
}) {
  const pad = { l: 44, r: 18, t: 16, b: 34 };

  const xs = series?.[0]?.data?.map((d) => d.x) ?? [];
  const xLabels = series?.[0]?.data?.map((d) => d.label) ?? [];

  const xScale = (i) => {
    const n = Math.max(xs.length - 1, 1);
    return pad.l + (i / n) * (width - pad.l - pad.r);
  };
  const yScale = (v) => {
    const clamped = Math.min(Math.max(v, yMin), yMax);
    const t = (clamped - yMin) / Math.max(yMax - yMin, 1);
    return height - pad.b - t * (height - pad.t - pad.b);
  };

  const yGrid = Array.from({ length: yTicks + 1 }, (_, i) => {
    const t = i / yTicks;
    const v = yMin + t * (yMax - yMin);
    return { v, y: yScale(v) };
  });

  const buildPath = (data) => {
    if (!data?.length) return "";
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.value)}`)
      .join(" ");
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width={width} height={height} style={{ display: "block" }}>
        {/* grid + y labels */}
        {yGrid.map((g, idx) => (
          <g key={idx}>
            <line
              x1={pad.l}
              y1={g.y}
              x2={width - pad.r}
              y2={g.y}
              stroke="rgba(0,0,0,0.08)"
            />
            <text
              x={8}
              y={g.y + 4}
              fontSize="11"
              fill="rgba(0,0,0,0.55)"
            >
              {INR(g.v)}
            </text>
          </g>
        ))}

        {/* x axis */}
        <line
          x1={pad.l}
          y1={height - pad.b}
          x2={width - pad.r}
          y2={height - pad.b}
          stroke="rgba(0,0,0,0.18)"
        />

        {/* x labels */}
        {xLabels.map((lab, i) => (
          <text
            key={lab}
            x={xScale(i)}
            y={height - 10}
            fontSize="11"
            fill="rgba(0,0,0,0.55)"
            textAnchor="middle"
          >
            {lab}
          </text>
        ))}

        {/* series paths */}
        {series.map((s, idx) => (
          <g key={idx}>
            <path
              d={buildPath(s.data)}
              fill="none"
              stroke={s.stroke || (idx === 0 ? "black" : "rgba(0,0,0,0.45)")}
              strokeWidth="2.2"
              strokeDasharray={s.dashed ? "6 6" : "0"}
            />
            {/* dots */}
            {s.data.map((d, i) => (
              <circle
                key={i}
                cx={xScale(i)}
                cy={yScale(d.value)}
                r="3"
                fill={s.stroke || (idx === 0 ? "black" : "rgba(0,0,0,0.45)")}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* legend */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        {series.map((s, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                width: 18,
                height: 2,
                background: s.stroke || (i === 0 ? "black" : "rgba(0,0,0,0.45)"),
                display: "inline-block",
                borderRadius: 99,
              }}
            />
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({
  width = 720,
  height = 220,
  data, // [{label, value}]
  yMin = 0,
  yMax,
  yTicks = 5,
  valueFormatter = (v) => `${v}`,
}) {
  const pad = { l: 44, r: 18, t: 16, b: 34 };
  const n = Math.max(data.length, 1);
  const maxV = yMax ?? Math.max(...data.map((d) => d.value), 1);

  const yScale = (v) => {
    const clamped = Math.min(Math.max(v, yMin), maxV);
    const t = (clamped - yMin) / Math.max(maxV - yMin, 1);
    return height - pad.b - t * (height - pad.t - pad.b);
  };

  const barW = (width - pad.l - pad.r) / n;
  const yGrid = Array.from({ length: yTicks + 1 }, (_, i) => {
    const t = i / yTicks;
    const v = yMin + t * (maxV - yMin);
    return { v, y: yScale(v) };
  });

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width={width} height={height} style={{ display: "block" }}>
        {yGrid.map((g, idx) => (
          <g key={idx}>
            <line
              x1={pad.l}
              y1={g.y}
              x2={width - pad.r}
              y2={g.y}
              stroke="rgba(0,0,0,0.08)"
            />
            <text
              x={8}
              y={g.y + 4}
              fontSize="11"
              fill="rgba(0,0,0,0.55)"
            >
              {valueFormatter(g.v)}
            </text>
          </g>
        ))}

        {/* bars */}
        {data.map((d, i) => {
          const x = pad.l + i * barW + barW * 0.18;
          const w = barW * 0.64;
          const y = yScale(d.value);
          const h = height - pad.b - y;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={10}
                fill="rgba(0,0,0,0.86)"
              />
              <text
                x={x + w / 2}
                y={height - 10}
                fontSize="11"
                fill="rgba(0,0,0,0.55)"
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Card({ title, subtitle, children, right }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 14,
        background: "white",
        boxShadow: "0 1px 10px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>{title}</div>
          {subtitle ? (
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function KPI({ label, value, delta, hint }) {
  const positive = typeof delta === "number" ? delta >= 0 : null;
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 14,
        background: "white",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        {typeof delta === "number" ? (
          <span
            style={{
              fontSize: 12,
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.12)",
              color:
                positive === null
                  ? "rgba(0,0,0,0.7)"
                  : positive
                  ? "rgba(0,0,0,0.85)"
                  : "rgba(0,0,0,0.85)",
              background: "rgba(0,0,0,0.03)",
            }}
          >
            {positive ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% MoM
          </span>
        ) : null}
        {hint ? (
          <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>{hint}</span>
        ) : null}
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map((t) => {
        const is = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              border: `1px solid ${is ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.10)"}`,
              background: is ? "rgba(0,0,0,0.06)" : "white",
              cursor: "pointer",
              fontSize: 13,
              color: "rgba(0,0,0,0.8)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function Table({ columns, rows }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        overflow: "hidden",
        background: "white",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(0,0,0,0.03)" }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || "left",
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "rgba(0,0,0,0.6)",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: "10px 12px",
                    fontSize: 13,
                    color: "rgba(0,0,0,0.82)",
                    textAlign: c.align || "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeatCell({ v }) {
  // v between 0 and 1
  const a = Math.max(0, Math.min(1, v));
  return (
    <div
      title={pct(a)}
      style={{
        height: 34,
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.10)",
        background: `rgba(0,0,0,${0.06 + a * 0.42})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: a > 0.45 ? "white" : "rgba(0,0,0,0.75)",
        fontWeight: 650,
      }}
    >
      {pct(a)}
    </div>
  );
}

/* ---------- DUMMY DATA ---------- */

function useDummyData() {
  return useMemo(() => {
    // Months (MoM)
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    // FY: current year vs last year, INR range 10L–60L
    const thisYear = [12, 18, 22, 31, 44, 57].map((lakh) => lakh * 100000);
    const lastYear = [10, 14, 19, 28, 39, 52].map((lakh) => lakh * 100000);

    const salesSeries = [
      {
        name: "Sales (This Year)",
        data: months.map((m, i) => ({ x: i, label: m, value: thisYear[i] })),
        stroke: "black",
      },
      {
        name: "Sales (Last Year)",
        data: months.map((m, i) => ({ x: i, label: m, value: lastYear[i] })),
        dashed: true,
        stroke: "rgba(0,0,0,0.45)",
      },
    ];

    const revenue = thisYear.reduce((a, b) => a + b, 0);
    const revenueLY = lastYear.reduce((a, b) => a + b, 0);
    const momDelta = ((thisYear[thisYear.length - 1] - thisYear[thisYear.length - 2]) / thisYear[thisYear.length - 2]) * 100;
    const yoyDelta = ((thisYear[thisYear.length - 1] - lastYear[lastYear.length - 1]) / lastYear[lastYear.length - 1]) * 100;

    // Customers
    const customersByMonth = [420, 510, 560, 640, 780, 910];
    const repeatRate = 0.36;
    const newVsRepeat = [
      { label: "New", value: 620 },
      { label: "Repeat", value: 290 },
    ];

    // Inventory
    const inventoryRows = [
      { sku: "SKU001", name: "Oxford Shirt", qty: 12, min: 15, status: "LOW", age_days: 24 },
      { sku: "SKU002", name: "Slim Jeans", qty: 40, min: 10, status: "OK", age_days: 41 },
      { sku: "SKU009", name: "Chinos", qty: 8, min: 12, status: "LOW", age_days: 67 },
      { sku: "SKU015", name: "Basic Tee", qty: 120, min: 30, status: "OK", age_days: 12 },
      { sku: "SKU021", name: "Sneakers", qty: 5, min: 6, status: "LOW", age_days: 103 },
    ];

    const agingBuckets = [
      { label: "0-30", value: 2400 },
      { label: "31-60", value: 900 },
      { label: "61-90", value: 600 },
      { label: "90+", value: 300 },
    ];

    // Customer list + top customers
    const topCustomers = [
      { customer: "Rahul S", orders: 8, revenue: 210000, last: "2026-02-03" },
      { customer: "Meera K", orders: 6, revenue: 178000, last: "2026-02-01" },
      { customer: "Aditi M", orders: 5, revenue: 142000, last: "2026-01-28" },
      { customer: "John D", orders: 4, revenue: 99000, last: "2026-01-25" },
    ];

    // Cohort matrix
    const cohort = [
      { cohort: "2025-10", m0: 1.0, m1: 0.42, m2: 0.31, m3: 0.24 },
      { cohort: "2025-11", m0: 1.0, m1: 0.38, m2: 0.29, m3: 0.20 },
      { cohort: "2025-12", m0: 1.0, m1: 0.35, m2: 0.0, m3: 0.0 },
      { cohort: "2026-01", m0: 1.0, m1: 0.0, m2: 0.0, m3: 0.0 },
    ];

    // Sales by category (bar)
    const salesByCategory = [
      { label: "Shirts", value: 1850000 },
      { label: "Denims", value: 1420000 },
      { label: "Tee", value: 980000 },
      { label: "Footwear", value: 760000 },
      { label: "Accessories", value: 420000 },
    ];

    return {
      months,
      salesSeries,
      kpis: {
        revenue,
        revenueLY,
        momDelta,
        yoyDelta,
        orders: 1240,
        units: 3890,
        aov: revenue / 1240,
        customers: 3120,
        repeatRate,
      },
      customersByMonth,
      newVsRepeat,
      salesByCategory,
      inventoryRows,
      agingBuckets,
      topCustomers,
      cohort,
    };
  }, []);
}

/* ---------- PAGE ---------- */

export default function AnalyticsHome() {
  const data = useDummyData();
  const [tab, setTab] = useState("sales");

  const yMinSales = 10 * 100000; // 10L
  const yMaxSales = 60 * 100000; // 60L

  return (
    <div style={{ padding: 18, background: "rgba(0,0,0,0.015)", minHeight: "calc(100vh - 60px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Analytics</h2>
          <p style={{ margin: "6px 0 0", color: "rgba(0,0,0,0.6)", fontSize: 13 }}>
            
          </p>
        </div>

        <Tabs
          tabs={[
            { key: "sales", label: "Sales Report" },
            { key: "customers", label: "Customer Report" },
            { key: "inventory", label: "Inventory Report" },
            { key: "aging", label: "Inventory Aging" },
            { key: "cohort", label: "Customer Cohort" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {/* KPI Row */}
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 12,
        }}
      >
        <div style={{ gridColumn: "span 3" }}>
          <KPI
            label="Total Sales (6 months)"
            value={INR(data.kpis.revenue)}
            delta={data.kpis.yoyDelta}
            hint="YoY vs last year"
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <KPI
            label="Orders"
            value={Math.round(data.kpis.orders).toLocaleString("en-IN")}
            delta={data.kpis.momDelta}
            hint="MoM growth"
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <KPI
            label="Units Sold"
            value={Math.round(data.kpis.units).toLocaleString("en-IN")}
            hint="Last 6 months"
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <KPI
            label="AOV"
            value={INR(data.kpis.aov)}
            hint={`Repeat rate: ${pct(data.kpis.repeatRate)}`}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
        {tab === "sales" && (
          <>
            <div style={{ gridColumn: "span 8" }}>
              <Card
                title="Monthly Sales Trend"
                subtitle="This Year vs Last Year"
                right={
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                    Latest: <b>{INR(data.salesSeries[0].data.at(-1).value)}</b>
                  </div>
                }
              >
                <LineChart series={data.salesSeries} yMin={yMinSales} yMax={yMaxSales} />
              </Card>
            </div>

            <div style={{ gridColumn: "span 4" }}>
              <Card title="Sales by Category" subtitle="Revenue contribution">
                <BarChart
                  data={data.salesByCategory.map((d) => ({ label: d.label, value: d.value }))}
                  yMin={0}
                  yMax={2000000}
                  valueFormatter={(v) => INR(v)}
                />
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="Top SKUs (Revenue)" subtitle="Top performers">
                <Table
                  columns={[
                    { key: "sku", label: "SKU" },
                    { key: "name", label: "Item" },
                    { key: "units", label: "Units", align: "right" },
                    { key: "revenue", label: "Revenue", align: "right", render: (r) => INR(r.revenue) },
                    {
                      key: "share",
                      label: "Share",
                      align: "right",
                      render: (r) =>
                        pct(r.revenue / Math.max(data.kpis.revenue / 6, 1)), // quick fake share
                    },
                  ]}
                  rows={[
                    { sku: "SKU001", name: "Oxford Shirt", units: 420, revenue: 1240000 },
                    { sku: "SKU009", name: "Chinos", units: 290, revenue: 980000 },
                    { sku: "SKU002", name: "Slim Jeans", units: 210, revenue: 860000 },
                    { sku: "SKU021", name: "Sneakers", units: 90, revenue: 640000 },
                    { sku: "SKU033", name: "Belt", units: 520, revenue: 420000 },
                  ]}
                />
              </Card>
            </div>
          </>
        )}

        {tab === "customers" && (
          <>
            <div style={{ gridColumn: "span 8" }}>
              <Card title="Customers Trend (Monthly)" subtitle="Unique customers per month">
                <LineChart
                  series={[
                    {
                      name: "Unique Customers",
                      data: data.customersByMonth.map((v, i) => ({
                        x: i,
                        label: data.months[i],
                        value: v,
                      })),
                      stroke: "black",
                    },
                  ]}
                  yMin={300}
                  yMax={1000}
                />
              </Card>
            </div>

            <div style={{ gridColumn: "span 4" }}>
              <Card title="New vs Repeat" subtitle="Orders split">
                <BarChart
                  data={data.newVsRepeat}
                  yMin={0}
                  yMax={800}
                  valueFormatter={(v) => `${Math.round(v)}`}
                />
                <div style={{ marginTop: 10, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                  Repeat rate (customers): <b>{pct(data.kpis.repeatRate)}</b>
                </div>
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="Top Customers" subtitle="High value customers">
                <Table
                  columns={[
                    { key: "customer", label: "Customer" },
                    { key: "orders", label: "Orders", align: "right" },
                    { key: "revenue", label: "Revenue", align: "right", render: (r) => INR(r.revenue) },
                    { key: "last", label: "Last Order" },
                  ]}
                  rows={data.topCustomers}
                />
              </Card>
            </div>
          </>
        )}

        {tab === "inventory" && (
          <>
            <div style={{ gridColumn: "span 5" }}>
              <Card title="Inventory Snapshot" subtitle="Core inventory KPIs">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <KPI label="Total SKUs" value="180" hint="Active catalog" />
                  <KPI label="Total Units" value="4,200" hint="SOH" />
                  <KPI label="Stock Value" value={INR(9800000)} hint="Cost × qty" />
                  <KPI label="Low Stock SKUs" value="14" hint="Below min level" />
                </div>
              </Card>
            </div>

            <div style={{ gridColumn: "span 7" }}>
              <Card title="Low Stock Risk" subtitle="Items below minimum stock level">
                <Table
                  columns={[
                    { key: "sku", label: "SKU" },
                    { key: "name", label: "Item" },
                    { key: "qty", label: "Qty", align: "right" },
                    { key: "min", label: "Min", align: "right" },
                    {
                      key: "status",
                      label: "Status",
                      align: "right",
                      render: (r) => (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: 999,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: r.status === "LOW" ? "rgba(0,0,0,0.06)" : "white",
                            fontWeight: 700,
                          }}
                        >
                          {r.status}
                        </span>
                      ),
                    },
                  ]}
                  rows={data.inventoryRows.filter((r) => r.status === "LOW")}
                />
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="Full Inventory List" subtitle="SOH + min + aging">
                <Table
                  columns={[
                    { key: "sku", label: "SKU" },
                    { key: "name", label: "Item" },
                    { key: "qty", label: "Qty", align: "right" },
                    { key: "min", label: "Min", align: "right" },
                    { key: "age_days", label: "Age (days)", align: "right" },
                    {
                      key: "status",
                      label: "Status",
                      align: "right",
                      render: (r) => (
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: 999,
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: r.status === "LOW" ? "rgba(0,0,0,0.06)" : "white",
                            fontWeight: 700,
                          }}
                        >
                          {r.status}
                        </span>
                      ),
                    },
                  ]}
                  rows={data.inventoryRows}
                />
              </Card>
            </div>
          </>
        )}

        {tab === "aging" && (
          <>
            <div style={{ gridColumn: "span 7" }}>
              <Card title="Inventory Aging (Units)" subtitle="Aging buckets based on last GRN date">
                <BarChart data={data.agingBuckets} yMin={0} yMax={2600} valueFormatter={(v) => `${Math.round(v)}`} />
              </Card>
            </div>
            <div style={{ gridColumn: "span 5" }}>
              <Card title="Stale Stock (90+ days)" subtitle="Needs markdown / promotion / liquidation">
                <Table
                  columns={[
                    { key: "sku", label: "SKU" },
                    { key: "name", label: "Item" },
                    { key: "qty", label: "Qty", align: "right" },
                    { key: "age_days", label: "Age", align: "right", render: (r) => `${r.age_days}d` },
                  ]}
                  rows={data.inventoryRows.filter((r) => r.age_days >= 90)}
                />
              </Card>
            </div>
          </>
        )}

        {tab === "cohort" && (
          <div style={{ gridColumn: "span 12" }}>
            <Card title="Customer Cohort Retention" subtitle="Retention by cohort month">
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 760 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px repeat(4, 1fr)",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
                      Cohort
                    </div>
                    {["M0", "M1", "M2", "M3"].map((m) => (
                      <div
                        key={m}
                        style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 700 }}
                      >
                        {m}
                      </div>
                    ))}

                    {data.cohort.map((row) => (
                      <>
                        <div key={row.cohort} style={{ fontSize: 13, fontWeight: 700 }}>
                          {row.cohort}
                        </div>
                        <HeatCell v={row.m0} />
                        <HeatCell v={row.m1} />
                        <HeatCell v={row.m2} />
                        <HeatCell v={row.m3} />
                      </>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                    Notes: M0 is always 100% (first purchase month). Subsequent months show repeat purchase retention.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
