// src/components/Teams.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Teams.css";
import "./TeamHeader.css";
import "./GroupsGrid.css";
import "./TeamDetail.css";
import "./OperativesGrid.css";
import "./DeployModal.css";

const nsgGroups = [
  {
    id: "51-sag",
    name: "51 Special Action Group",
    code: "51 SAG",
    specialization: "Counter-Terrorism",
    description:
      "Elite <strong>counter-terrorism</strong> unit specializing in <em>hostage rescue operations</em> and high-risk interventions",
    color: "nsg-red",
    contact: "sag51.command@nsg.gov.in",
    phone: "+91-11-2671-5100",
    location: "New Delhi HQ",
    operatives: 120,
    activeMissions: 8,
    successRate: "99.2%",
    type: "sag",
    established: "1985",
  },
  {
    id: "52-sag",
    name: "52 Special Action Group",
    code: "52 SAG",
    specialization: "Anti-Hijack Operations",
    description:
      "Specialized in <strong>aircraft and vehicle hijack scenarios</strong> with rapid response capabilities",
    color: "nsg-blue",
    contact: "sag52.command@nsg.gov.in",
    phone: "+91-11-2671-5200",
    location: "Indira Gandhi Airport",
    operatives: 85,
    activeMissions: 3,
    successRate: "98.7%",
    type: "sag",
    established: "1986",
  },
  {
    id: "11-srg",
    name: "11 Special Ranger Group",
    code: "11 SRG",
    specialization: "Counter-Terror & Logistics",
    description:
      "Comprehensive <strong>logistics and perimeter security</strong> support for extended operations",
    color: "nsg-green",
    contact: "srg11.command@nsg.gov.in",
    phone: "+91-11-2671-1100",
    location: "Manesar Base",
    operatives: 150,
    activeMissions: 12,
    successRate: "97.9%",
    type: "srg",
    established: "1985",
  },
  {
    id: "12-srg",
    name: "12 Special Ranger Group",
    code: "12 SRG",
    specialization: "Urban Warfare & Rapid Deployment",
    description:
      "<strong>Metropolitan combat operations</strong> and rapid response in urban environments",
    color: "nsg-purple",
    contact: "srg12.command@nsg.gov.in",
    phone: "+91-11-2671-1200",
    location: "Delhi Metro Area",
    operatives: 110,
    activeMissions: 9,
    successRate: "98.3%",
    type: "srg",
    established: "1987",
  },
  {
    id: "13-srg",
    name: "13 Special Ranger Group",
    code: "13 SRG",
    specialization: "VIP Protection & Support",
    description:
      "Elite security for <strong>high-profile targets and critical events</strong>",
    color: "nsg-indigo",
    contact: "srg13.command@nsg.gov.in",
    phone: "+91-11-2671-1300",
    location: "Raisina Hills",
    operatives: 95,
    activeMissions: 15,
    successRate: "100%",
    type: "srg",
    established: "1988",
  },
  {
    id: "scg",
    name: "Special Composite Group",
    code: "SCG",
    specialization: "Regional Operations",
    description:
      "<strong>Regional response units</strong> across major metropolitan hubs and strategic locations",
    color: "nsg-orange",
    contact: "scg.command@nsg.gov.in",
    phone: "+91-11-2671-7000",
    location: "National HQ",
    operatives: 280,
    activeMissions: 22,
    successRate: "98.5%",
    type: "scg",
    established: "1990",
  },
  {
    id: "esg",
    name: "Electronic Support Group",
    code: "ESG",
    specialization: "Technical & Communications",
    description:
      "Advanced <strong>technical and electronic warfare</strong> support for modern combat scenarios",
    color: "nsg-gray",
    contact: "esg.command@nsg.gov.in",
    phone: "+91-11-2671-9000",
    location: "Electronic Warfare Center",
    operatives: 65,
    activeMissions: 18,
    successRate: "99.8%",
    type: "esg",
    established: "1992",
  },
  {
    id: "nbdc",
    name: "National Bomb Data Centre",
    code: "NBDC",
    specialization: "Bomb Disposal & EOD",
    description:
      "Specialized in <strong>bomb disposal and IED neutralization</strong> with advanced detection systems",
    color: "nsg-yellow",
    contact: "nbdc.command@nsg.gov.in",
    phone: "+91-11-2671-9500",
    location: "Bomb Disposal Center",
    operatives: 45,
    activeMissions: 11,
    successRate: "99.5%",
    type: "nbdc",
    established: "1991",
  },
];

// ========== GroupsGrid ==========
function GroupsGrid({
  nsgGroups,
  getActiveOperativesCount,
  onContact,
  onViewTeam,
}) {
  const renderDescription = (description) => {
    return { __html: description };
  };

  return (
    <div className="groups-grid">
      {nsgGroups.map((group) => (
        <div key={group.id} className={`group-card ${group.color}`}>
          <div className="card-glow"></div>

          <div className="group-card-header">
            <div className="group-title">
              <div className="title-section">
                <h3 className="group-name">{group.name}</h3>
                <p className="group-code">{group.code}</p>
              </div>
              <div className="established-badge">Est. {group.established}</div>
            </div>
          </div>

          <div className="group-specialization">
            <span className="specialization-icon">⚡</span>
            {group.specialization}
          </div>

          <p
            className="group-description"
            dangerouslySetInnerHTML={renderDescription(group.description)}
          />

          <div className="group-stats">
            <div className="stat-item">
              <span className="stat-value">
                {getActiveOperativesCount(group.code)}
              </span>
              <span className="stat-label">Active Operatives</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{group.operatives}</span>
              <span className="stat-label">Total Strength</span>
            </div>
            <div className="stat-item highlight">
              <span
                className={`stat-value success-rate ${
                  parseFloat(group.successRate) > 98
                    ? "high"
                    : parseFloat(group.successRate) > 95
                    ? "medium"
                    : "low"
                }`}
              >
                {group.successRate}
                {parseFloat(group.successRate) > 98
                  ? " 🎯"
                  : parseFloat(group.successRate) > 95
                  ? " ✓"
                  : " ⚡"}
              </span>
              <span className="stat-label">Mission Success</span>
            </div>
          </div>

          <div className="mission-status">
            <div className="mission-indicator">
              <span
                className={`status-dot ${
                  group.activeMissions > 10
                    ? "high"
                    : group.activeMissions > 5
                    ? "medium"
                    : "low"
                }`}
              ></span>
              <span className="mission-count">
                {group.activeMissions} Active Missions
              </span>
            </div>
          </div>

          <div className="group-contact">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">{group.location}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">{group.phone}</span>
            </div>
          </div>

          <div className="group-actions">
            <button
              className="nsg-btn primary small"
              onClick={() => onViewTeam(group.code)}
            >
              <span>👁️</span>
              View Team
            </button>
            <button
              className="nsg-btn outline small"
              onClick={() => onContact(group)}
            >
              <span>📧</span>
              Contact Command
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ========== TeamHeader ==========
function TeamHeader({ deployedOperativesCount, onDeployClick }) {
  return (
    <div className="team-header">
      <div className="header-background"></div>
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">
            NSG <span className="highlight-text">Command Center</span>
          </h1>
          <p className="header-subtitle">
            National Security Guard <strong>Elite Teams</strong> & Specialized
            Operatives
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-content">
              <div className="stat-value">{nsgGroups.length}</div>
              <div className="stat-label">Specialized Groups</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-value">{deployedOperativesCount}</div>
              <div className="stat-label">Active Deployments</div>
            </div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Operational Readiness</div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-actions">
        <button className="nsg-btn primary large" onClick={onDeployClick}>
          <span className="btn-icon">🎯</span>
          Deploy New Operative
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ========== TeamDetail ==========
function TeamDetail({
  currentGroup,
  onBack,
  filteredOperatives,
  searchQuery,
  onSearchChange,
  getStatusColor,
  onContactOperative,
  onDeploy,
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "🟢";
      case "on-mission":
        return "🔴";
      case "off-duty":
        return "⚫";
      case "training":
        return "🟡";
      case "standby":
        return "🟠";
      default:
        return "⚪";
    }
  };

  return (
    <div className="team-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <span>←</span>
          Back to All Teams
        </button>
        <div className="group-info-card">
          <div className="group-header-main">
            <div className="group-identity">
              <h1 className="group-title-main">{currentGroup.name}</h1>
              <div className="group-code-badge">{currentGroup.code}</div>
            </div>
            <div className="group-spec-badge">
              <span className="spec-icon">⚡</span>
              {currentGroup.specialization}
            </div>
          </div>

          <div className="group-stats-overview">
            <div className="overview-stat">
              <span className="overview-value highlight">
                {currentGroup.successRate}
              </span>
              <span className="overview-label">Success Rate</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">
                {currentGroup.activeMissions}
              </span>
              <span className="overview-label">Active Missions</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{currentGroup.operatives}</span>
              <span className="overview-label">Total Operatives</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{currentGroup.established}</span>
              <span className="overview-label">Established</span>
            </div>
          </div>

          <div className="group-description-main">
            <p
              dangerouslySetInnerHTML={{ __html: currentGroup.description }}
            />
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-box-enhanced">
            <input
              type="text"
              placeholder="Search operatives by name, role, or specialization..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input-enhanced"
            />
            <span className="search-icon-enhanced">🔍</span>
          </div>
          <div className="search-stats">
            <span className="results-count">{filteredOperatives.length}</span>
            <span className="results-label">operatives available</span>
          </div>
        </div>
      </div>

      <div className="operatives-grid-enhanced">
        {filteredOperatives.length > 0 ? (
          filteredOperatives.map((operative) => (
            <div key={operative.id} className="operative-card-enhanced">
              <div className="operative-card-glow"></div>

              <div className="operative-header-enhanced">
                <div className="operative-identity">
                  <div className="operative-avatar-enhanced">
                    <span className="avatar-text">
                      {operative.name.split(" ")[1]?.charAt(0) || "O"}
                    </span>
                  </div>
                  <div className="operative-info-enhanced">
                    <h3 className="operative-name-enhanced">
                      {operative.name}
                    </h3>
                    <p className="operative-id-enhanced">{operative.id}</p>
                  </div>
                </div>
                <div className="status-section">
                  <span className="status-icon">
                    {getStatusIcon(operative.status)}
                  </span>
                  <div
                    className={`status-badge-enhanced ${getStatusColor(
                      operative.status
                    )}`}
                  >
                    {operative.status.replace("-", " ")}
                  </div>
                </div>
              </div>

              <div className="operative-details-enhanced">
                <div className="detail-item-enhanced">
                  <span className="detail-label-enhanced">Primary Role:</span>
                  <span className="detail-value-enhanced highlight-role">
                    {operative.role}
                  </span>
                </div>
                <div className="detail-item-enhanced">
                  <span className="detail-label-enhanced">
                    Missions Completed:
                  </span>
                  <span className="detail-value-enhanced highlight-number">
                    {operative.missionsCompleted}
                  </span>
                </div>
                <div className="detail-item-enhanced">
                  <span className="detail-label-enhanced">Base Location:</span>
                  <span className="detail-value-enhanced">
                    {operative.location}
                  </span>
                </div>
              </div>

              <div className="operative-contact-enhanced">
                <div className="contact-info-enhanced">
                  <span className="contact-email">{operative.email}</span>
                  <span className="contact-phone">{operative.phone}</span>
                </div>
              </div>

              <div className="operative-actions-enhanced">
                <button
                  className="nsg-btn outline small"
                  onClick={() => onContactOperative(operative)}
                >
                  <span>📞</span>
                  Contact
                </button>
                <button
                  className="nsg-btn primary small deploy-btn"
                  onClick={() => onDeploy(operative)}
                  disabled={operative.status === "on-mission"}
                >
                  <span>
                    {operative.status === "on-mission" ? "🔴" : "🎯"}
                  </span>
                  {operative.status === "on-mission"
                    ? "On Mission"
                    : "Deploy"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-enhanced">
            <div className="empty-icon">🔍</div>
            <h3>No Operatives Found</h3>
            <p>Try adjusting your search criteria or browse all teams</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== DeployModal ==========
function DeployModal({
  show,
  onClose,
  newOperative,
  onOperativeChange,
  nsgGroups,
  onAddOperative,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay-enhanced">
      <div className="modal-content-enhanced">
        <div className="modal-glow"></div>

        <div className="modal-header-enhanced">
          <div className="modal-title-section">
            <h2>Deploy New Operative</h2>
            <p className="modal-subtitle">
              Add a new specialist to the <strong>NSG roster</strong>
            </p>
          </div>
          <button className="close-button-enhanced" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="modal-body-enhanced">
          <div className="form-grid-enhanced">
            <div className="form-group-enhanced">
              <label className="form-label">
                <span className="label-text">Full Name</span>
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                value={newOperative.name}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    name: e.target.value,
                  })
                }
                placeholder="Enter operative's full name"
                className="form-input"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">
                <span className="label-text">Primary Role</span>
                <span className="required-star">*</span>
              </label>
              <select
                value={newOperative.role}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    role: e.target.value,
                  })
                }
                className="form-select"
              >
                <option value="">Select Specialization</option>
                <option value="Commander">👑 Commander</option>
                <option value="Team Leader">🛡️ Team Leader</option>
                <option value="Assault Specialist">🔫 Assault Specialist</option>
                <option value="Sniper">🎯 Sniper</option>
                <option value="Medic">➕ Medic</option>
                <option value="Tech Specialist">💻 Tech Specialist</option>
                <option value="EOD Specialist">💣 EOD Specialist</option>
                <option value="Communications">📡 Communications</option>
              </select>
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                value={newOperative.email}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    email: e.target.value,
                  })
                }
                placeholder="operative@nsg.gov.in"
                className="form-input"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">Secure Phone</label>
              <input
                type="tel"
                value={newOperative.phone}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    phone: e.target.value,
                  })
                }
                placeholder="+91-XXX-XXXXXXX"
                className="form-input"
              />
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">
                <span className="label-text">Assigned Group</span>
                <span className="required-star">*</span>
              </label>
              <select
                value={newOperative.group}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    group: e.target.value,
                  })
                }
                className="form-select"
              >
                <option value="">Select Elite Group</option>
                {nsgGroups.map((group) => (
                  <option key={group.id} value={group.code}>
                    {group.code} - {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">Special Skills</label>
              <input
                type="text"
                value={newOperative.specialization}
                onChange={(e) =>
                  onOperativeChange({
                    ...newOperative,
                    specialization: e.target.value,
                  })
                }
                placeholder="Advanced tactical skills"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group-enhanced full-width">
            <label className="form-label">Deployment Base</label>
            <input
              type="text"
              value={newOperative.location}
              onChange={(e) =>
                onOperativeChange({
                  ...newOperative,
                  location: e.target.value,
                })
              }
              placeholder="Primary operational location"
              className="form-input"
            />
          </div>
        </div>

        <div className="modal-footer-enhanced">
          <button className="nsg-btn outline" onClick={onClose}>
            Cancel Deployment
          </button>
          <button className="nsg-btn primary large" onClick={onAddOperative}>
            <span className="btn-icon">🚀</span>
            Deploy Operative
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Main Teams Component ==========
export default function Teams() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [operatives, setOperatives] = useState([]);
  const [newOperative, setNewOperative] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    specialization: "",
    group: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [deployedOperatives, setDeployedOperatives] = useState([]);

  const navigate = useNavigate();

  // generate dummy operatives
  useEffect(() => {
    const generateOperatives = () => {
      const roles = [
        "Commander",
        "Team Leader",
        "Assault Specialist",
        "Sniper",
        "Medic",
        "Tech Specialist",
        "EOD Specialist",
        "Communications",
      ];
      const statuses = [
        "active",
        "on-mission",
        "training",
        "off-duty",
        "standby",
      ];

      const operativesData = [];
      nsgGroups.forEach((group) => {
        for (let i = 0; i < 8; i++) {
          const role = roles[Math.floor(Math.random() * roles.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          operativesData.push({
            id: `${group.code}-${100 + i}`,
            name: `Operative ${group.code}-${100 + i}`,
            role,
            status,
            group: group.code,
            missionsCompleted: Math.floor(Math.random() * 50) + 10,
            email: `operative${100 + i}@${group.contact.split("@")[1]}`,
            phone: `+91-${
              9000000000 + Math.floor(Math.random() * 100000000)
            }`,
            location: group.location,
          });
        }
      });
      return operativesData;
    };

    setOperatives(generateOperatives());
  }, []);

  const currentGroup =
    selectedGroup === "all"
      ? null
      : nsgGroups.find((g) => g.code === selectedGroup);

  const filteredOperatives = useMemo(() => {
    return operatives.filter((op) => {
      const matchesGroup = selectedGroup === "all" || op.group === selectedGroup;
      const matchesSearch =
        searchQuery === "" ||
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [operatives, selectedGroup, searchQuery]);

  const getActiveOperativesCount = (groupCode) => {
    return operatives.filter(
      (op) =>
        op.group === groupCode &&
        (op.status === "active" || op.status === "on-mission")
    ).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "on-mission":
        return "status-on-mission";
      case "off-duty":
        return "status-off-duty";
      case "training":
        return "status-training";
      case "standby":
        return "status-standby";
      default:
        return "status-default";
    }
  };

  const handleDeploy = (operative) => {
    setLoading(true);

    setTimeout(() => {
      setDeployedOperatives((prev) => [...prev, operative]);
      setLoading(false);

      navigate("/cases", {
        state: {
          operative,
          group: currentGroup,
          deployedAt: new Date().toISOString(),
        },
      });
    }, 1000);
  };

  const handleAddNewOperative = () => {
    if (!newOperative.name || !newOperative.role || !newOperative.group) {
      alert("Please fill in all required fields");
      return;
    }

    const newOp = {
      id: `${newOperative.group}-${Date.now()}`,
      ...newOperative,
      missionsCompleted: 0,
    };

    setOperatives((prev) => [...prev, newOp]);
    setNewOperative({
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      specialization: "",
      group: "",
      status: "active",
    });
    setShowDeployModal(false);

    alert(`New operative ${newOp.name} deployed successfully!`);
  };

  const handleContact = (group) => {
    alert(`Contacting ${group.name} at ${group.contact}`);
  };

  const handleContactOperative = (operative) => {
    alert(`Contacting ${operative.name} at ${operative.email}`);
  };

  return (
    <div className="teams-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Deploying...</div>
        </div>
      )}

      {/* center content like the reference dashboard */}
      <div className="teams-inner">
        <TeamHeader
          deployedOperativesCount={deployedOperatives.length}
          onDeployClick={() => setShowDeployModal(true)}
        />

        {selectedGroup === "all" ? (
          <GroupsGrid
            nsgGroups={nsgGroups}
            getActiveOperativesCount={getActiveOperativesCount}
            onContact={handleContact}
            onViewTeam={setSelectedGroup}
          />
        ) : (
          currentGroup && (
            <TeamDetail
              currentGroup={currentGroup}
              onBack={() => setSelectedGroup("all")}
              filteredOperatives={filteredOperatives}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              getStatusColor={getStatusColor}
              onContactOperative={handleContactOperative}
              onDeploy={handleDeploy}
            />
          )
        )}

        <DeployModal
          show={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          newOperative={newOperative}
          onOperativeChange={setNewOperative}
          nsgGroups={nsgGroups}
          onAddOperative={handleAddNewOperative}
        />
      </div>
    </div>
  );
}
