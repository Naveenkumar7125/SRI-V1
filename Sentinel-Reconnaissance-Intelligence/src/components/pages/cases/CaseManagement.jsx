// CaseManagement.jsx
import React, { useState, useMemo } from "react";
import "./CaseManagement.css";
import RegisterCaseModal from "./RegisterCaseModal";

const mockCases = [
  {
    id: "NSG-CT-1023",
    title: "Unauthorized Entry at Gate 2",
    type: "Intrusion Detection",
    date: "20/11/2025",
    status: "Under Investigation",
    threatLevel: "High",
    team: "Strike Team Alpha",
    location: "Gate 2, North Perimeter",
    evidenceCount: 4,
    lastUpdated: "21/11/2025",
    zone: "Red",
  },
  {
    id: "NSG-AVSEC-1024",
    title: "Suspicious Package at Terminal 3",
    type: "Object Detection",
    date: "22/11/2025",
    status: "Ongoing",
    threatLevel: "Critical",
    team: "Airport Platoon Bravo",
    location: "Terminal 3, Departure Hall",
    evidenceCount: 3,
    lastUpdated: "22/11/2025",
    zone: "Amber",
  },
  {
    id: "NSG-ROUTE-1025",
    title: "Vehicle Trespass in Restricted Lane",
    type: "Vehicle Analytics",
    date: "30/10/2025",
    status: "Completed",
    threatLevel: "Low",
    team: "Route Protection Charlie",
    location: "Restricted Lane 4",
    evidenceCount: 1,
    lastUpdated: "01/11/2025",
    zone: "Green",
  },
  {
    id: "NSG-FR-1026",
    title: "Watchlist Face Match at Arrival Lobby",
    type: "Face Recognition",
    date: "15/11/2025",
    status: "Active",
    threatLevel: "High",
    team: "Surveillance Delta",
    location: "Arrival Lobby – Main Concourse",
    evidenceCount: 5,
    lastUpdated: "19/11/2025",
    zone: "Red",
  },
];

const CaseManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [threatFilter, setThreatFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredCases = useMemo(() => {
    return mockCases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || c.status === statusFilter;

      const matchesThreat =
        threatFilter === "All" || c.threatLevel === threatFilter;

      const matchesType = typeFilter === "All" || c.type === typeFilter;

      return matchesSearch && matchesStatus && matchesThreat && matchesType;
    });
  }, [search, statusFilter, threatFilter, typeFilter]);

  const totalCases = mockCases.length;
  const criticalCases = mockCases.filter(
    (c) => c.threatLevel === "Critical" || c.threatLevel === "High"
  ).length;
  const activeCases = mockCases.filter(
    (c) => c.status === "Active" || c.status === "Ongoing"
  ).length;
  const redZoneCases = mockCases.filter((c) => c.zone === "Red").length;

  return (
    <div className="case-page">
      {/* HEADER */}
      <header className="case-header">
        <div className="case-header-left">
         
          <h1 className="case-title">CASE MANAGEMENT CONSOLE</h1>
          <p className="case-subtitle">
            Unified registry for NSG video-analytics incidents, live
            interventions, and post-operation review.
          </p>
        </div>

        <div className="case-header-right">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search case ID, location, team or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="case-search-input"
            />
          </div>
          <button
            className="primary-btn"
            onClick={() => setShowRegisterModal(true)}
          >
            + Register New NSG Case
          </button>
        </div>
      </header>

      {/* SUMMARY STRIP */}
      <section className="case-summary-strip">
        <div className="summary-card">
          <p className="summary-label">Total Cases in Registry</p>
          <p className="summary-value">{totalCases}</p>
          <span className="summary-tag">All NSG zones</span>
        </div>
        <div className="summary-card">
          <p className="summary-label">High / Critical Threats</p>
          <p className="summary-value">{criticalCases}</p>
          <span className="summary-tag">Priority monitoring</span>
        </div>
        <div className="summary-card">
          <p className="summary-label">Active / Live Incidents</p>
          <p className="summary-value">{activeCases}</p>
          <span className="summary-tag">Field teams engaged</span>
        </div>
        <div className="summary-card">
          <p className="summary-label">Red Zone Deployments</p>
          <p className="summary-value">{redZoneCases}</p>
          <span className="summary-tag">High-risk grids</span>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="case-filter-bar">
        <div className="filter-item">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>New</option>
            <option>Under Investigation</option>
            <option>Active</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Threat Level</label>
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Case Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All</option>
            <option>Face Recognition</option>
            <option>Intrusion Detection</option>
            <option>Object Detection</option>
            <option>Vehicle Analytics</option>
            <option>Other</option>
          </select>
        </div>
      </section>

      {/* CASE GRID */}
      <main className="case-grid">
        {filteredCases.map((c) => (
          <article className="case-card" key={c.id}>
            <div className="case-card-header">
              <div>
                <p className="case-id">{c.id}</p>
                <h2 className="case-card-title">{c.title}</h2>
                <p className="case-type">{c.type}</p>
              </div>
              <div className="case-pill-group">
                <span className={`pill pill-threat-${c.threatLevel.toLowerCase()}`}>
                  {c.threatLevel}
                </span>
                <span className="pill pill-status">{c.status}</span>
              </div>
            </div>

            <div className="case-card-body">
              <div className="case-meta-row">
                <span className="meta-label">Zone Grid</span>
                <span className={`meta-zone meta-zone-${c.zone.toLowerCase()}`}>
                  {c.zone} Zone
                </span>
              </div>
              <div className="case-meta-row">
                <span className="meta-label">Location</span>
                <span className="meta-value">{c.location}</span>
              </div>
              <div className="case-meta-row">
                <span className="meta-label">Lead Team</span>
                <span className="meta-value">{c.team}</span>
              </div>
              <div className="case-meta-row">
                <span className="meta-label">Evidence</span>
                <span className="meta-value">
                  {c.evidenceCount} item(s) • Updated {c.lastUpdated}
                </span>
              </div>
              <div className="case-meta-row">
                <span className="meta-label">Incident Date</span>
                <span className="meta-value">{c.date}</span>
              </div>
            </div>

            <div className="case-card-footer">
              <div className="card-footer-left">
                <button className="ghost-btn">Open Case File</button>
                <button className="ghost-btn">Evidence Workspace</button>
              </div>
              <div className="card-footer-right">
                <button className="text-btn">Download Brief</button>
              </div>
            </div>
          </article>
        ))}

        {filteredCases.length === 0 && (
          <div className="empty-state">
            <p>No cases match the current filters.</p>
          </div>
        )}
      </main>

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <RegisterCaseModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
};

export default CaseManagement;
