import React from 'react';
import "./OperativesGrid.css";

const OperativesGrid = ({
  filteredOperatives,
  searchQuery,
  onSearchChange,
  getStatusColor,
  onContactOperative,
  onDeploy
}) => {
  return (
    <div className="operatives-section">
      <div className="section-header">
        <h3 className="section-title">
          Team Operatives ({filteredOperatives.length})
        </h3>

        <div className="search-section">
          <div className="search-container">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              placeholder="Search by name or role..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredOperatives.length === 0 ? (
        <div className="empty-state">
          <p>No operatives found matching your search.</p>
        </div>
      ) : (
        <div className="operatives-grid">
          {filteredOperatives.map((operative, index) => (
            <div
              key={operative.id}
              className={`operative-card nsg-${(index % 8 === 0 && "red") ||
                (index % 8 === 1 && "blue") ||
                (index % 8 === 2 && "green") ||
                (index % 8 === 3 && "purple") ||
                (index % 8 === 4 && "indigo") ||
                (index % 8 === 5 && "orange") ||
                (index % 8 === 6 && "gray") ||
                (index % 8 === 7 && "yellow")}`}
            >
              <div className="operative-header">
                <div className="operative-avatar">
                  {operative.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="operative-info-main">
                  <div className="operative-name-role">
                    <h3 className="operative-name">{operative.name}</h3>
                    <p className="operative-role">{operative.role}</p>
                  </div>
                  <span
                    className={`status-badge ${getStatusColor(
                      operative.status
                    )}`}
                  >
                    {operative.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="operative-details">
                <div className="detail-item">
                  <span className="detail-label">Missions Completed</span>
                  <span className="detail-value">
                    {operative.missionsCompleted}
                  </span>
                </div>
                {operative.specialization && (
                  <div className="detail-item">
                    <span className="detail-label">Specialization</span>
                    <span className="detail-value specialization">
                      {operative.specialization}
                    </span>
                  </div>
                )}
                {operative.base && (
                  <div className="detail-item">
                    <span className="detail-label">Base Location</span>
                    <span className="detail-value">{operative.base}</span>
                  </div>
                )}
                {operative.lastMission && (
                  <div className="detail-item">
                    <span className="detail-label">Last Mission</span>
                    <span className="detail-value">
                      {operative.lastMission}
                    </span>
                  </div>
                )}
              </div>

              {operative.skills && operative.skills.length > 0 && (
                <div className="operative-skills">
                  {operative.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="operative-footer">
                <div className="mission-count">
                  {operative.missionsCompleted} missions
                </div>
                <div className="operative-actions">
                  <button
                    className="nsg-btn outline small"
                    onClick={() => onContactOperative(operative)}
                  >
                    Contact
                  </button>
                  <button
                    className="nsg-btn primary small"
                    onClick={() => onDeploy(operative)}
                    disabled={operative.status === "on-mission"}
                  >
                    {operative.status === "on-mission"
                      ? "On Mission"
                      : "Deploy"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OperativesGrid;
