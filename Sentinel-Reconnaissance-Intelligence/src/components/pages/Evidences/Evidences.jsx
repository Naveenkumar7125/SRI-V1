import React, { useState } from "react";
import "./Evidences.css";

// Live monitoring data
const liveEvidences = [
  {
    id: 1,
    fileName: "cam_entrance_north_live",
    uploadedAt: "Stream • Platform 3, Central Station",
    duration: "12:45:30",
    events: 3,
    location: "Platform 3, Central Station",
    status: "Active Stream",
  },
  {
    id: 2,
    fileName: "cam_mall_entrance_live",
    uploadedAt: "Stream • Mall Entrance - North Gate",
    duration: "08:22:15",
    events: 1,
    location: "Mall Entrance - North Gate",
    status: "Active Stream",
  },
  {
    id: 3,
    fileName: "cam_parking_b_live",
    uploadedAt: "Stream • Parking Zone B",
    duration: "15:10:45",
    events: 0,
    location: "Parking Zone B",
    status: "Active Stream",
  },
];

// Uploaded evidence data
const uploadEvidences = [
  {
    id: 1,
    fileName: "20241208_075812.mp4",
    uploadedAt: "Dec 08, 2024 • 01:28 PM",
    duration: "00:01:30",
    events: 4,
    location: "Platform 3, Central Station",
    status: "Reviewed",
  },
  {
    id: 2,
    fileName: "20241207_221530.mp4",
    uploadedAt: "Dec 07, 2024 • 10:15 PM",
    duration: "00:02:10",
    events: 2,
    location: "Mall Entrance - North Gate",
    status: "Pending Review",
  },
  {
    id: 3,
    fileName: "20241206_181244.mp4",
    uploadedAt: "Dec 06, 2024 • 06:12 PM",
    duration: "00:00:58",
    events: 1,
    location: "Parking Zone B",
    status: "Archived",
  },
];

const Evidences = () => {
  const [activeTab, setActiveTab] = useState("live");

  const currentEvidences =
    activeTab === "live" ? liveEvidences : uploadEvidences;

  const subtitleText =
    activeTab === "live"
      ? "Monitor incoming camera streams and capture key incidents in real time."
      : "Review processed surveillance footage and AI-generated incident summaries.";

  return (
    <div className="evidences-page">
      {/* Sticky header (like settings page) */}
      <div className="evidences-header-shell">
        <header className="evidences-header-main">
          <div>
            <h1 className="ev-title">Evidence Center</h1>
            <p className="ev-subtitle">{subtitleText}</p>
          </div>
        </header>

        <nav className="ev-tabs-row">
          <button
            type="button"
            className={`ev-tab ${activeTab === "live" ? "is-active" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            Live Streams
          </button>
          <button
            type="button"
            className={`ev-tab ${
              activeTab === "upload" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Uploaded Footage
          </button>
        </nav>
      </div>

      {/* Filters row */}
      <div className="evidences-filters">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            <span className="search-icon-circle" />
            <span className="search-icon-handle" />
          </span>
          <input
            type="text"
            placeholder={
              activeTab === "live"
                ? "Search by camera name, location, or stream status"
                : "Search by file name, location, or review status"
            }
          />
        </div>
        <div className="chip-group">
          <button className="chip chip-active" type="button">
            All
          </button>
          <button className="chip" type="button">
            With Events
          </button>
          <button className="chip" type="button">
            No Events
          </button>
          <button className="chip" type="button">
            Recent
          </button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="evidences-grid">
        {currentEvidences.map((item) => (
          <article key={item.id} className="evidence-card">
            {/* Top row */}
            <div className="evidence-card-header">
              <div className="file-info">
                <div className="file-icon">
                  <span
                    className={`icon ${
                      activeTab === "live" ? "icon-camera" : "icon-file"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="file-name">{item.fileName}</h3>
                  <p className="file-meta">{item.uploadedAt}</p>
                </div>
              </div>
            </div>

            {/* Middle stats */}
            <div className="evidence-card-body">
              <div className="stat">
                <span className="stat-label">
                  {activeTab === "live"
                    ? "Current incidents"
                    : "Events detected"}
                </span>
                <span className="stat-value">{item.events}</span>
              </div>
              <div className="stat">
                <span className="stat-label">
                  {activeTab === "live" ? "Stream duration" : "Video duration"}
                </span>
                <span className="stat-value">{item.duration}</span>
              </div>
              <div className="stat stat-wide">
                <span className="stat-label">Location</span>
                <span className="stat-value stat-location">
                  {item.location}
                </span>
              </div>
            </div>

            {/* Summary strip */}
            <div className="evidence-summary">
              <span className="summary-label">Summary</span>
              <p className="summary-text">
                {activeTab === "live"
                  ? "This camera stream is actively monitored. Detected incidents are logged for further analysis and reporting."
                  : "This recording has been processed by the system. Detected incidents, snapshots, and timelines are available in the detailed report."}
              </p>
            </div>

            {/* Footer */}
            <div className="evidence-card-footer">
              <span
                className={`status-pill status-${item.status
                  .split(" ")[0]
                  .toLowerCase()}`}
              >
                {item.status}
              </span>
              <div className="card-actions">
                <button className="link-button" type="button">
                  {activeTab === "live" ? "Open Stream" : "View Report"}
                </button>
                <button className="btn-primary-small" type="button">
                  {activeTab === "live" ? "Open Analysis" : "Download PDF"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Evidences;
