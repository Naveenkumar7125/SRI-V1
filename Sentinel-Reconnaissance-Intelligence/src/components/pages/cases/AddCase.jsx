// File: Cases.jsx
import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AddCase.css";

// Mock data (replace with API data in real app)
const initialCases = [
  {
    id: "CASE-1023",
    title: "Unauthorized Entry at Gate 2",
    team: "Team Alpha",
    threatLevel: "Critical",
    status: "Under Investigation",
    createdOn: "2025-11-20T14:32:00Z",
    evidenceCount: 4,
    description:
      "Multiple alerts captured near Gate 2. Individual attempted to access a restricted NSG zone.",
    evidence: [
      { id: "E1", type: "video", thumb: null, name: "gate2_clip1.mp4" },
      { id: "E2", type: "image", thumb: null, name: "gate2_img1.jpg" },
    ],
    fir: null,
    location: "Gate 2, North Wing",
    priority: "Critical",
    assignedOfficer: "NSG Operative Sharma",
    lastUpdated: "2025-11-21T10:15:00Z",
  },
  {
    id: "CASE-1024",
    title: "Suspicious Package at Terminal 3",
    team: "Team Bravo",
    threatLevel: "Moderate",
    status: "Ongoing",
    createdOn: "2025-11-22T09:10:00Z",
    evidenceCount: 2,
    description:
      "Unattended bag detected by surveillance. NSG perimeter established and zone isolated.",
    evidence: [],
    fir: {
      number: "FIR-2025-007",
      filedBy: "NSG Legal Liaison R. Kumar",
      date: "2025-11-23",
      witness: "NSG Security Staff John Doe",
      note: "Package contained electronic devices. Bomb squad unit engaged for inspection.",
    },
    location: "Terminal 3, Departures",
    priority: "Elevated",
    assignedOfficer: "NSG Operative Rao",
    lastUpdated: "2025-11-22T15:30:00Z",
  },
  {
    id: "CASE-1025",
    title: "Vehicle Trespass in Restricted Lane",
    team: "Team Charlie",
    threatLevel: "Low",
    status: "Completed",
    createdOn: "2025-10-30T06:20:00Z",
    evidenceCount: 1,
    description:
      "Vehicle violated barrier protocol and moved into an NSG restricted lane. Driver detained and cleared.",
    evidence: [],
    fir: null,
    location: "Restricted Lane 4",
    priority: "Routine",
    assignedOfficer: "NSG Operative Singh",
    lastUpdated: "2025-11-01T09:45:00Z",
  },
  {
    id: "CASE-1026",
    title: "Cyber Security Breach Attempt",
    team: "Team Alpha",
    threatLevel: "Critical",
    status: "FIR Filed - Legal Action Started",
    createdOn: "2025-11-15T08:20:00Z",
    evidenceCount: 3,
    description:
      "Multiple failed login attempts from unauthorized IP addresses targeting NSG core systems.",
    evidence: [
      { id: "E3", type: "log", thumb: null, name: "server_logs.txt" },
      { id: "E4", type: "image", thumb: null, name: "ip_trace.jpg" },
    ],
    fir: {
      number: "FIR-2025-012",
      filedBy: "NSG Cyber Unit Lead",
      date: "2025-11-16",
      witness: "IT Department Head",
      note: "Case escalated to cyber crime division for advanced forensic investigation.",
    },
    location: "Data Center, Building B",
    priority: "Critical",
    assignedOfficer: "NSG Operative Nair",
    lastUpdated: "2025-11-18T14:20:00Z",
  },
];

// Helper functions for badge colors
function getThreatLevelColor(level) {
  switch (level.toLowerCase()) {
    case "critical":
      return "#dc2626";
    case "moderate":
      return "#d97706";
    case "low":
      return "#059669";
    default:
      return "#64748b";
  }
}

function getPriorityColor(priority) {
  switch (priority.toLowerCase()) {
    case "critical":
      return "#7c3aed";
    case "elevated":
      return "#dc2626";
    case "routine":
      return "#64748b";
    default:
      return "#64748b";
  }
}

export default function Cases() {
  const [cases, setCases] = useState(initialCases);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [threatFilter, setThreatFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    title: "",
    description: "",
    team: "",
    threatLevel: "Moderate",
    location: "",
    priority: "Routine",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const teams = useMemo(
    () => Array.from(new Set(cases.map((c) => c.team))),
    [cases]
  );

  // Filtering
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const searchText = `${c.id} ${c.title} ${c.description} ${c.location}`.toLowerCase();
      const matchesQuery = searchText.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesThreat =
        threatFilter === "All" || c.threatLevel === threatFilter;
      return matchesQuery && matchesStatus && matchesThreat;
    });
  }, [cases, query, statusFilter, threatFilter]);

  // Case details functions
  function openCaseDetails(c) {
    setSelectedCase(c);
  }

  function closeCaseDetails() {
    setSelectedCase(null);
  }

  function navigateToEvidence(caseId) {
    window.location.href = `/evidence?case=${caseId}`;
  }

  // New case creation
  function submitNewCase(e) {
    e.preventDefault();
    const newCase = {
      id: `CASE-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      ...newCaseForm,
      status: "Under Investigation",
      evidenceCount: selectedImage ? 1 : 0,
      evidence: selectedImage
        ? [
            {
              id: `E${Math.floor(Math.random() * 1000)}`,
              type: "image",
              thumb: URL.createObjectURL(selectedImage),
              name: selectedImage.name,
            },
          ]
        : [],
      fir: null,
      createdOn: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedOfficer: "Unassigned NSG Operative",
    };

    setCases((prev) => [newCase, ...prev]);
    setShowCreateCase(false);
    setNewCaseForm({
      title: "",
      description: "",
      team: "",
      threatLevel: "Moderate",
      location: "",
      priority: "Routine",
    });
    setSelectedImage(null);
  }

  // Image upload handler
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  }

  // PDF Report Generation with direct download
  function generateCaseReport(caseData) {
    const reportDiv = document.createElement("div");
    reportDiv.style.position = "absolute";
    reportDiv.style.left = "-9999px";
    reportDiv.style.top = "0";
    reportDiv.style.width = "210mm";
    reportDiv.style.padding = "20px";
    reportDiv.style.backgroundColor = "white";
    reportDiv.style.color = "black";
    reportDiv.style.fontFamily = "Arial, sans-serif";

    reportDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
        <h1 style="color: #2563eb; margin: 0 0 10px 0; font-size: 24px;">NSG INCIDENT REPORT</h1>
        <h2 style="color: #374151; margin: 0; font-size: 18px;">${caseData.title}</h2>
        <p style="color: #666; margin: 10px 0 0 0;">Report Generated: ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Case Overview</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; background: #f8fafc; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Case ID:</strong>
            <span>${caseData.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Status:</strong>
            <span>${caseData.status}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Threat Level:</strong>
            <span style="background: ${getThreatLevelColor(
              caseData.threatLevel
            )}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">${
      caseData.threatLevel
    }</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Priority:</strong>
            <span style="background: ${getPriorityColor(
              caseData.priority
            )}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">${
      caseData.priority
    }</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Team:</strong>
            <span>${caseData.team}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Location:</strong>
            <span>${caseData.location}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Created:</strong>
            <span>${new Date(caseData.createdOn).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0;">
            <strong>Last Updated:</strong>
            <span>${new Date(caseData.lastUpdated).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Incident Description</h3>
        <p style="line-height: 1.6; margin: 0;">${caseData.description}</p>
      </div>
      
      ${
        caseData.evidence.length > 0
          ? `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Attached Evidence</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Type</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">File Name</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Evidence ID</th>
            </tr>
          </thead>
          <tbody>
            ${caseData.evidence
              .map(
                (ev) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${
                  ev.type.charAt(0).toUpperCase() + ev.type.slice(1)
                }</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${
                  ev.name
                }</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${
                  ev.id
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : ""
      }
      
      ${
        caseData.fir
          ? `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">FIR Details</h3>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
          <div style="margin-bottom: 10px;"><strong>FIR Number:</strong> ${caseData.fir.number}</div>
          <div style="margin-bottom: 10px;"><strong>Filed By:</strong> ${caseData.fir.filedBy}</div>
          <div style="margin-bottom: 10px;"><strong>Date Filed:</strong> ${caseData.fir.date}</div>
          ${
            caseData.fir.witness
              ? `<div style="margin-bottom: 10px;"><strong>Witness:</strong> ${caseData.fir.witness}</div>`
              : ""
          }
          ${
            caseData.fir.note
              ? `<div style="margin-top: 10px; padding: 10px; background: white; border-left: 4px solid #8b5cf6;"><strong>Notes:</strong> ${caseData.fir.note}</div>`
              : ""
          }
        </div>
      </div>
      `
          : '<div style="margin-bottom: 25px;"><p><em>No FIR recorded for this NSG case.</em></p></div>'
      }
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
        <p><strong>CONFIDENTIAL DOCUMENT</strong> - For authorized NSG personnel only</p>
        <p>Generated by NSG Sentinel Management System | ${new Date().getFullYear()}</p>
      </div>
    `;

    document.body.appendChild(reportDiv);

    html2canvas(reportDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Case-Report-${caseData.id}.pdf`);
        document.body.removeChild(reportDiv);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        document.body.removeChild(reportDiv);
        const blob = new Blob(
          [
            `Case Report for ${caseData.id}\n\n${caseData.title}\n\n${caseData.description}`,
          ],
          { type: "text/plain" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Case-Report-${caseData.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  }

  // Quick actions
  function quickUpdateCase(caseId, updates) {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, ...updates, lastUpdated: new Date().toISOString() }
          : c
      )
    );
  }

  return (
    <div className="cases-page">
      <header className="cases-header">
        <div>
          <h1>NSG Case Management</h1>
          <p className="muted">
            Comprehensive NSG incident tracking and operational case management
          </p>
        </div>
        <div className="header-actions">
          <input
            className="search-input"
            placeholder="Search NSG cases, IDs, descriptions, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="action-buttons">
            <button
              className="btn primary"
              onClick={() => setShowCreateCase(true)}
            >
              + Register New Case
            </button>
          </div>
        </div>
      </header>

      {/* Statistics Dashboard and Filters Side by Side */}
      <div className="dashboard-section">
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{cases.length}</div>
            <div className="stat-label">Total NSG Cases</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {cases.filter((c) => c.threatLevel === "Critical").length}
            </div>
            <div className="stat-label">Critical Threats</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {
                cases.filter(
                  (c) =>
                    c.status === "Ongoing" ||
                    c.status === "Under Investigation"
                ).length
              }
            </div>
            <div className="stat-label">Active NSG Cases</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {cases.filter((c) => c.fir).length}
            </div>
            <div className="stat-label">Cases with FIR</div>
          </div>
        </section>

        <section className="filters-section">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Ongoing</option>
              <option>Under Investigation</option>
              <option>Completed</option>
              <option>FIR Filed - Legal Action Started</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Threat Level</label>
            <select
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>Critical</option>
            </select>
          </div>
        </section>
      </div>

      {/* Cases Grid */}
      <section className="case-grid">
        {filteredCases.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon" />
            <h3>No NSG cases match the filters</h3>
            <p>Adjust search terms or reset filters to view all records.</p>
            <button
              className="btn primary"
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setThreatFilter("All");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {filteredCases.map((c) => (
          <article key={c.id} className="case-card">
            <div className="case-card-header">
              <div className="case-meta">
                <h3 className="case-title">{c.title}</h3>
                <div className="muted small">
                  {c.id} • {new Date(c.createdOn).toLocaleDateString()}
                </div>
              </div>
              <div className="badge-wrap">
                <span
                  className={`badge threat ${c.threatLevel.toLowerCase()}`}
                >
                  {c.threatLevel}
                </span>
                <span
                  className={`badge priority ${c.priority.toLowerCase()}`}
                >
                  {c.priority} Priority
                </span>
                <span
                  className={`badge status ${
                    c.status.includes("FIR") ? "fir" : ""
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>

            <p className="desc">{c.description}</p>

            <div className="case-details">
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span>{c.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Team:</span>
                <span>{c.team}</span>
              </div>
            </div>

            <div className="card-meta">
              <div className="meta-item">
                Evidence: <strong>{c.evidenceCount}</strong>
              </div>
              <div className="meta-item">
                Updated:{" "}
                <strong>
                  {new Date(c.lastUpdated).toLocaleDateString()}
                </strong>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn" onClick={() => openCaseDetails(c)}>
                View Details
              </button>
              <button className="btn" onClick={() => navigateToEvidence(c.id)}>
                Evidence Workspace
              </button>
              <button
                className="btn outline"
                onClick={() => generateCaseReport(c)}
              >
                Download Report
              </button>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button
                className="quick-btn success"
                onClick={() =>
                  quickUpdateCase(c.id, { status: "Completed" })
                }
                title="Mark case as completed"
              >
                Mark Completed
              </button>
              <button
                className="quick-btn warning"
                onClick={() =>
                  quickUpdateCase(c.id, { priority: "Critical" })
                }
                title="Mark as critical priority"
              >
                Critical Priority
              </button>
              <button
                className="quick-btn danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to remove this NSG case record?"
                    )
                  ) {
                    setCases((prev) =>
                      prev.filter((caseItem) => caseItem.id !== c.id)
                    );
                  }
                }}
                title="Remove case from registry"
              >
                Remove Case
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Create Case Modal */}
      {showCreateCase && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateCase(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New NSG Case</h2>
              <div className="muted">
                Capture a fresh NSG incident into the central case registry
              </div>
            </div>
            <form className="modal-body form" onSubmit={submitNewCase}>
              <div className="form-row">
                <div className="form-group">
                  <label>Case Title *</label>
                  <input
                    value={newCaseForm.title}
                    onChange={(e) =>
                      setNewCaseForm({
                        ...newCaseForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="Brief NSG incident title"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newCaseForm.description}
                  onChange={(e) =>
                    setNewCaseForm({
                      ...newCaseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed description for NSG operations"
                  required
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>NSG Team *</label>
                  <select
                    value={newCaseForm.team}
                    onChange={(e) =>
                      setNewCaseForm({
                        ...newCaseForm,
                        team: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Threat Level</label>
                  <select
                    value={newCaseForm.threatLevel}
                    onChange={(e) =>
                      setNewCaseForm({
                        ...newCaseForm,
                        threatLevel: e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Moderate</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    value={newCaseForm.location}
                    onChange={(e) =>
                      setNewCaseForm({
                        ...newCaseForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="Incident location in NSG zone"
                  />
                </div>
                <div className="form-group">
                  <label>Priority Tier</label>
                  <select
                    value={newCaseForm.priority}
                    onChange={(e) =>
                      setNewCaseForm({
                        ...newCaseForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option>Routine</option>
                    <option>Elevated</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label>Upload Image Evidence</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="image-upload"
                    className="image-upload-btn"
                  >
                    Choose Image
                  </label>
                  {selectedImage && (
                    <div className="image-preview">
                      <span className="file-name">
                        {selectedImage.name}
                      </span>
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setSelectedImage(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCreateCase(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Save NSG Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={closeCaseDetails}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCase.title}</h2>
              <div className="muted">
                {selectedCase.id} • {selectedCase.team}
              </div>
              <div className="modal-badges">
                <span
                  className={`badge threat ${selectedCase.threatLevel.toLowerCase()}`}
                >
                  {selectedCase.threatLevel}
                </span>
                <span
                  className={`badge priority ${selectedCase.priority.toLowerCase()}`}
                >
                  {selectedCase.priority} Priority
                </span>
                <span
                  className={`badge status ${
                    selectedCase.status.includes("FIR") ? "fir" : ""
                  }`}
                >
                  {selectedCase.status}
                </span>
              </div>
            </div>
            <div className="modal-body">
              <div className="case-overview">
                <div className="overview-item">
                  <label>Location</label>
                  <span>{selectedCase.location}</span>
                </div>
                <div className="overview-item">
                  <label>Assigned NSG Operative</label>
                  <span>{selectedCase.assignedOfficer}</span>
                </div>
                <div className="overview-item">
                  <label>Created</label>
                  <span>
                    {new Date(
                      selectedCase.createdOn
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="overview-item">
                  <label>Last Updated</label>
                  <span>
                    {new Date(
                      selectedCase.lastUpdated
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="section">
                <h4>Operational Description</h4>
                <p>{selectedCase.description}</p>
              </div>

              <div className="modal-row">
                <div className="section">
                  <h4>Evidence ({selectedCase.evidenceCount})</h4>
                  <div className="evidence-list">
                    {selectedCase.evidence.length === 0 ? (
                      <div className="muted small">
                        No evidence attached yet for this NSG case.
                      </div>
                    ) : (
                      selectedCase.evidence.map((ev) => {
                        let label = "DOC";
                        if (ev.type === "video") label = "VID";
                        else if (ev.type === "image") label = "IMG";
                        else if (ev.type === "log") label = "LOG";

                        return (
                          <div key={ev.id} className="evidence-item">
                            <div className="thumb">{label}</div>
                            <div className="evidence-meta">
                              <div className="small">{ev.name}</div>
                              <div className="muted small">
                                {ev.type}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <button
                    className="btn outline"
                    onClick={() =>
                      navigateToEvidence(selectedCase.id)
                    }
                  >
                    Open Evidence Workspace
                  </button>
                </div>

                <div className="section">
                  <h4>FIR Details</h4>
                  {selectedCase.fir ? (
                    <div className="fir-block">
                      <div>
                        <strong>{selectedCase.fir.number}</strong>
                      </div>
                      <div className="muted small">
                        Filed by {selectedCase.fir.filedBy} on{" "}
                        {selectedCase.fir.date}
                      </div>
                      {selectedCase.fir.witness && (
                        <div className="muted small">
                          Witness: {selectedCase.fir.witness}
                        </div>
                      )}
                      {selectedCase.fir.note && (
                        <div className="fir-note">
                          <strong>Notes:</strong>{" "}
                          {selectedCase.fir.note}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="muted small">
                      No FIR recorded for this NSG case.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={closeCaseDetails}>
                Close
              </button>
              <button
                className="btn outline"
                onClick={() => generateCaseReport(selectedCase)}
              >
                Download NSG Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
