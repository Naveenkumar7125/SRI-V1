// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { key: "dashboard", label: "Command Center", icon: "command" },
  { key: "upload", label: "Report Generator", icon: "report" },
  { key: "live", label: "Evidences", icon: "evidence" },
  { key: "cases", label: "Case", icon: "case" },
  { key: "settings", label: "Settings", icon: "settings" },
];

// Map menu keys to routes
const routeMap = {
  dashboard: "/",
  upload: "/upload",
  live: "/live",
  cases: "/cases",
  settings: "/settings",
};

// Dummy recent reports (wire this to backend later)
const recentReports = [
  "Suspicious activity – Gate 2",
  "Crowd anomaly – Platform 4",
  "Perimeter breach – Sector 7",
  "Unattended object – Lobby",
  "Intrusion alert – West fence",
  "Abandoned vehicle – Parking bay 3",
  "Unauthorized access – Control room",
  "Loitering detected – Corridor C",
  "Motion after hours – Storage block",
  "Masked person detected – Zone 9",
];

const Sidebar = ({ onSelect }) => {
  const [active, setActive] = useState("dashboard");

  const navigate = useNavigate();
  const location = useLocation();

  // Sync active item with current URL
  useEffect(() => {
    const found = Object.entries(routeMap).find(
      ([, path]) => path === location.pathname
    );
    if (found) setActive(found[0]);
  }, [location.pathname]);

  const handleSelect = (key) => {
    setActive(key);
    const path = routeMap[key];
    if (path) navigate(path);
    if (onSelect) onSelect(key);
  };

  const renderIcon = (type) => {
    switch (type) {
      case "command":
        return <CommandIcon />;
      case "report":
        return <ReportIcon />;
      case "evidence":
        return <EvidenceIcon />;
      case "case":
        return <CaseIcon />;
      case "unit":
        return <UnitIcon />;
      case "settings":
        return <SettingsIcon />;
      default:
        return <CommandIcon />;
    }
  };

  // Later you can make recent reports navigate to a case by adding onClick
  const handleRecentClick = (report) => {
    console.log("Open report:", report);
    // e.g., navigate("/cases?id=123")
  };

  return (
    <aside className="sidebar expanded">
      {/* Top Brand (logo only, top-left) */}
      <div className="sidebar-top">
        <div className="brand-wrapper">
          <div className="brand-left">
            <img
              src="src/assets/logo.png"
              alt="Command Center"
              className="brand-logo"
            />
          </div>
        </div>
      </div>

      {/* Main menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${active === item.key ? "active" : ""}`.trim()}
            onClick={() => handleSelect(item.key)}
            title={item.label}
            type="button"
          >
            <span className="menu-icon-wrapper">{renderIcon(item.icon)}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Recent reports – fills remaining height & is scrollable */}
      <section className="recent-reports">
        <h3 className="recent-header">Recent reports</h3>
        <div className="recent-list">
          {recentReports.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="recent-item"
              title={item}
              onClick={() => handleRecentClick(item)}
            >
              <span className="recent-text">{item}</span>
              <span className="recent-arrow">›</span>
            </button>
          ))}
        </div>
      </section>

      {/* Status Footer at very bottom */}
      <div className="status">
        <span className="dot" />
        <span className="status-text">System Online</span>
      </div>
    </aside>
  );
};

/* ================== ICON COMPONENTS ================== */

const CommandIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="3"
      ry="3"
      strokeWidth="1.7"
    />
    <path
      d="M8 9h8M8 13h5M8 17h3"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReportIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M7 4h7l5 5v11H7z"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 4v5h5"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13h4M10 16h2"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EvidenceIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect
      x="4"
      y="5"
      width="16"
      height="14"
      rx="2"
      ry="2"
      strokeWidth="1.7"
    />
    <circle cx="12" cy="12" r="3" strokeWidth="1.7" />
    <path
      d="M17 8.5v.01"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaseIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="12"
      rx="2"
      ry="2"
      strokeWidth="1.7"
    />
    <path
      d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 11h18"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UnitIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="8" cy="9" r="3" strokeWidth="1.7" />
    <circle cx="16" cy="9" r="3" strokeWidth="1.7" />
    <path
      d="M4 19v-1.5A3.5 3.5 0 0 1 7.5 14h1A3.5 3.5 0 0 1 12 17.5V19"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19v-1.5A3.5 3.5 0 0 1 15.5 14h1A3.5 3.5 0 0 1 20 17.5V19"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="menu-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="3" strokeWidth="1.7" />
    <path
      d="M19.4 15a1.8 1.8 0 0 0 .34 2l.06.06a1.4 1.4 0 0 1-2 2l-.06-.06a1.8 1.8 0 0 0-2-.34 1.8 1.8 0 0 0-1 1.6V21a1.4 1.4 0 0 1-2.8 0v-.12a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .34l-.06.06a1.4 1.4 0 0 1-2-2l.06-.06a1.8 1.8 0 0 0 .34-2 1.8 1.8 0 0 0-1.6-1H3a1.4 1.4 0 0 1 0-2.8h.12a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.34-2l-.06-.06a1.4 1.4 0 1 1 2-2l.06.06a1.8 1.8 0 0 0 2 .34 1.8 1.8 0 0 0 1-1.6V3a1.4 1.4 0 0 1 2.8 0v.12a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.34l.06-.06a1.4 1.4 0 0 1 2 2l-.06.06a1.8 1.8 0 0 0-.34 2 1.8 1.8 0 0 0 1.6 1H21a1.4 1.4 0 0 1 0 2.8h-.12a1.8 1.8 0 0 0-1.6 1Z"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Sidebar;
