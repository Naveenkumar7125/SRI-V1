import React from "react";
import "./analysisCard.css";

const kpis = [
  {
    label: "Total AI Alerts",
    value: "804",
    delta: "+18% vs yesterday",
    deltaType: "up",
  },
  {
    label: "Critical Incidents",
    value: "46",
    delta: "12 unresolved",
    deltaType: "warn",
  },
  {
    label: "Cameras Online",
    value: "58 / 62",
    delta: "4 offline nodes",
    deltaType: "down",
  },
  {
    label: "Avg Response Time",
    value: "2m 34s",
    delta: "-21% faster",
    deltaType: "up",
  },
];

const trendData = [
  { label: "Mon", alerts: 40, critical: 10 },
  { label: "Tue", alerts: 55, critical: 14 },
  { label: "Wed", alerts: 62, critical: 18 },
  { label: "Thu", alerts: 50, critical: 12 },
  { label: "Fri", alerts: 78, critical: 21 },
  { label: "Sat", alerts: 70, critical: 19 },
  { label: "Sun", alerts: 64, critical: 16 },
];

const breakdown = [
  { label: "Weapon Detection", value: 38, className: "bd-critical" },
  { label: "Suspicious Activity", value: 27, className: "bd-warning" },
  { label: "Face / Watchlist Match", value: 21, className: "bd-info" },
  { label: "Crowd / Zone Anomaly", value: 14, className: "bd-muted" },
];

const mockAlerts = [
  {
    id: "#A-1085",
    time: "21:14 IST",
    camera: "Gate 2 – Staff Entry",
    type: "Watchlist Match",
    severity: "High",
    status: "In Review",
  },
  {
    id: "#A-1084",
    time: "20:56 IST",
    camera: "Lobby – Main Hall",
    type: "Suspicious Movement",
    severity: "Medium",
    status: "Acknowledged",
  },
  {
    id: "#A-1083",
    time: "20:41 IST",
    camera: "Parking – Zone A",
    type: "Weapon Detection",
    severity: "Critical",
    status: "Escalated",
  },
  {
    id: "#A-1082",
    time: "20:10 IST",
    camera: "Corridor – Block C",
    type: "Crowd Anomaly",
    severity: "Low",
    status: "Closed",
  },
];

const AnalysisCard = () => {
  // Prepare SVG line data
  const maxValue = Math.max(...trendData.map((d) => d.alerts));
  const maxCritical = Math.max(...trendData.map((d) => d.critical));
  const width = 320;
  const height = 120;
  const stepX = width / (trendData.length - 1);

  const alertsPoints = trendData
    .map((d, i) => {
      const x = i * stepX;
      const y = height - (d.alerts / maxValue) * (height - 10);
      return `${x},${y}`;
    })
    .join(" ");

  const criticalPoints = trendData
    .map((d, i) => {
      const x = i * stepX;
      const y = height - (d.critical / maxCritical) * (height - 10);
      return `${x},${y}`;
    })
    .join(" ");

  const totalBreakdown = breakdown.reduce((sum, b) => sum + b.value, 0);

  return (
    <section className="analysis-card">
      {/* TOP: KPIs */}
      <div className="analysis-kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi-card" key={kpi.label}>
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-value">{kpi.value}</span>
            <span
              className={`kpi-delta ${
                kpi.deltaType === "up"
                  ? "delta-up"
                  : kpi.deltaType === "down"
                  ? "delta-down"
                  : "delta-warn"
              }`}
            >
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* MIDDLE: Chart row */}
      <div className="analysis-main-row">
        {/* Alert Analytics (line chart) */}
        <div className="panel panel-chart">
          <div className="panel-header">
            <div>
              <h3>Alert Analytics</h3>
              <p>Online vs critical alerts · last 7 days</p>
            </div>
            <select className="panel-select" aria-label="Time range">
              <option>Last 7 days</option>
              <option>Last 24 hours</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="chart-wrapper">
            <svg
              className="line-chart"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
            >
              {/* baseline grid */}
              <defs>
                <linearGradient id="alertFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </linearGradient>
              </defs>

              {/* filled area for alerts */}
              <polygon
                className="area-alerts"
                points={`${alertsPoints} ${width},${height} 0,${height}`}
              />

              {/* alerts line */}
              <polyline
                className="line-alerts"
                fill="none"
                strokeWidth="2.5"
                points={alertsPoints}
              />

              {/* critical line */}
              <polyline
                className="line-critical"
                fill="none"
                strokeWidth="2"
                strokeDasharray="4 3"
                points={criticalPoints}
              />
            </svg>

            <div className="chart-x-axis">
              {trendData.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>

            <div className="chart-legend">
              <span className="legend-pill lp-alerts">Total alerts</span>
              <span className="legend-pill lp-critical">Critical alerts</span>
            </div>
          </div>
        </div>

        {/* Detection Mix (donut + breakdown) */}
        <div className="panel panel-donut">
          <div className="panel-header">
            <div>
              <h3>Detection Mix</h3>
              <p>Distribution by incident type</p>
            </div>
          </div>

          <div className="donut-row">
            <div className="donut-wrapper">
              <div
                className="donut-chart"
                style={{
                  background: `conic-gradient(
                    #ef4444 0deg ${3.6 * breakdown[0].value}deg,
                    #f97316 ${3.6 * breakdown[0].value}deg ${
                    3.6 * (breakdown[0].value + breakdown[1].value)
                  }deg,
                    #3b82f6 ${3.6 * (breakdown[0].value + breakdown[1].value)}deg ${
                    3.6 *
                    (breakdown[0].value + breakdown[1].value + breakdown[2].value)
                  }deg,
                    #6b7280 ${
                      3.6 *
                      (breakdown[0].value +
                        breakdown[1].value +
                        breakdown[2].value)
                    }deg 360deg
                  )`,
                }}
              >
                <div className="donut-inner">
                  <span className="donut-value">{totalBreakdown}</span>
                  <span className="donut-label">Detections</span>
                </div>
              </div>
            </div>

            <ul className="donut-legend">
              {breakdown.map((b) => (
                <li className="donut-legend-item" key={b.label}>
                  <span className={`donut-dot ${b.className}`} />
                  <div className="donut-legend-text">
                    <span className="d-label">{b.label}</span>
                    <span className="d-sub">{b.value}% of total</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM: Recent alerts table */}
      <div className="panel panel-table">
        <div className="panel-header">
          <div>
            <h3>Recent Alert Activity</h3>
            <p>NSG command feed · last hour</p>
          </div>
          <button className="panel-link">View all alerts →</button>
        </div>

        <div className="table-wrapper">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Time (IST)</th>
                <th>Camera</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.time}</td>
                  <td>{row.camera}</td>
                  <td>{row.type}</td>
                  <td>
                    <span
                      className={`sev-pill ${
                        row.severity === "Critical"
                          ? "sev-critical"
                          : row.severity === "High"
                          ? "sev-high"
                          : row.severity === "Medium"
                          ? "sev-medium"
                          : "sev-low"
                      }`}
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        row.status === "Escalated"
                          ? "st-escalated"
                          : row.status === "In Review"
                          ? "st-review"
                          : row.status === "Closed"
                          ? "st-closed"
                          : "st-ack"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AnalysisCard;
