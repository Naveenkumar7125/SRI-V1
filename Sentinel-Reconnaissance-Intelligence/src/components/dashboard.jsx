// dashboard.jsx
import React, { useState } from "react";
import LiveFeedsSection from "./landers/LiveFeedsSection";
import AnalysisCard from "./landers/AnalysisCard";
import AlertOverlay from "./Alert/AlertOverlay";  // <-- IMPORTANT
import "./dashboard.css";
import UserIcon from "../assets/download.svg";

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      {/* Left */}
      <div className="dh-left">
        <h1 className="dh-title">Sentinel Reconnaissance Intelligence</h1>
      </div>

      {/* Middle */}
      <div className="dh-middle">
        <div className="dh-middle-block">
          <span className="dh-label">Location</span>
          <span className="dh-value">NSG HQ · Manesar, Haryana, India</span>
        </div>

        <span className="dh-separator">·</span>

        <div className="dh-middle-block">
          <span className="dh-label">Local Time (IST)</span>
          <span className="dh-value">18:42</span>
        </div>

        <span className="dh-separator">·</span>

        <div className="dh-weather">
          <div className="dh-weather-icon">
            <span className="dh-weather-sun" />
            <span className="dh-weather-cloud" />
          </div>
          <div className="dh-weather-text">
            <span className="dh-value">28°C · Partly Cloudy</span>
            <span className="dh-label">Humidity 64% · Vis. 8 km</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="dh-right">
        <img src={UserIcon} alt="User Profile" className="dh-user-real-icon" />
        <div className="dh-user-info">
          <span className="dh-label">Operator</span>
          <span className="dh-value">NSG Ops Analyst · H-01</span>
          <span className="dh-label">Clearance · Level III</span>
        </div>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const [activeAlert, setActiveAlert] = useState(null);

  const triggerAlert = () => {
    setActiveAlert({
      severity: "CRITICAL",
      title: "Missing Person Alert",
      name: "Dharmo",
      lastSeenLocation: "Main Block - Gate 2",
      time: "03:00 PM",
      clothing: "White shirt, black pants, spectacles",
      status: "Searching",
      assignedTo: "Security Team A",
      photoUrl: "https://via.placeholder.com/160x200.png?text=Target",
      createdAgo: "2 mins ago",
    });
  };

  return (
    <div
      className={`dashboard-container ${activeAlert ? "blur-active" : ""}`}
      style={{ transition: "0.3s" }}
    >
      <DashboardHeader />
      <LiveFeedsSection />
      <AnalysisCard />

      {/* TEMP BUTTON: REMOVE LATER */}
      <button
        onClick={triggerAlert}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          padding: "14px 22px",
          background: "#ef4444",
          color: "#fff",
          fontWeight: "600",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0px 6px 20px rgba(255,0,0,0.35)",
        }}
      >
        Trigger Test Alert
      </button>

      {/* ALERT OVERLAY */}
      <AlertOverlay
        alert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onProceed={() => {
          console.log("Proceeding with Incident Protocol...");
        }}
        onManage={() => {
          console.log("Opening Incident Management Console...");
        }}
      />
    </div>
  );
};

export default Dashboard;
