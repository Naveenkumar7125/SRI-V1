// src/components/AlertOverlay.jsx
import React from "react";
import "./AlertOverlay.css";

const AlertOverlay = ({
  alert,
  onClose,
  onProceed,
  onManage,
}) => {
  // If no alert data is passed, don’t render anything
  if (!alert) return null;

  const {
    severity = "CRITICAL",
    title = "Missing Person Alert",
    name = "Unknown",
    lastSeenLocation = "Not Available",
    time = "-- : --",
    clothing = "Not Available",
    status = "Searching",
    assignedTo = "Response Unit – Alpha",
    createdAgo = "Just now",
    recommendations = [],
    photoUrl = "https://via.placeholder.com/160x200.png?text=Person",
  } = alert;

  return (
    <div className="alert-overlay">
      {/* Clickable blurred backdrop */}
      <div className="alert-backdrop" onClick={onClose} />

      {/* Main alert card */}
      <div className="alert-card">
        {/* left red accent bar */}
        <div className="alert-accent" />

        <div className="alert-content">
          {/* Header */}
          <div className="alert-header-row">
            <div className="alert-header-main">
              <span className={`alert-severity alert-severity-${severity.toLowerCase()}`}>
                {severity}
              </span>
              <h2 className="alert-title">{title}</h2>
            </div>

            <div className="alert-header-meta">
              <span className="alert-time-ago">{createdAgo}</span>
              {onClose && (
                <button
                  className="alert-close-btn"
                  onClick={onClose}
                  aria-label="Close alert"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Person & details */}
          <div className="alert-main-body">
            <div className="alert-photo-wrapper">
              <img
                src={photoUrl}
                alt="Person of interest"
                className="alert-photo"
              />
            </div>

            <div className="alert-details-wrapper">
              <div className="alert-details-grid">
                <div>
                  <span className="label">Name:</span>
                  <span className="value">{name}</span>
                </div>
                <div>
                  <span className="label">Last Seen:</span>
                  <span className="value">{lastSeenLocation}</span>
                </div>
                <div>
                  <span className="label">Time:</span>
                  <span className="value">{time}</span>
                </div>
                <div>
                  <span className="label">Clothing:</span>
                  <span className="value">{clothing}</span>
                </div>
              </div>

              <div className="alert-status-row">
                <span className="status-pill">
                  <span className="status-dot" />
                  {status}
                </span>
                <span className="assigned-text">
                  Assigned to: <strong>{assignedTo}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="alert-reco-section">
            <h3 className="alert-reco-title">Recommended Immediate Actions</h3>
            <ul className="alert-reco-list">
              {recommendations.length ? (
                recommendations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))
              ) : (
                <>
                  <li>
                    Dispatch nearest Sentinel security unit to last seen
                    location for rapid sweep.
                  </li>
                  <li>
                    Cross-check live CCTV feeds and archived footage for last
                    known movement path.
                  </li>
                  <li>
                    Push public announcement with description to campus / zone
                    speakers and control app.
                  </li>
                  <li>
                    Coordinate with local authorities if person is not located
                    within the next 15 minutes.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="alert-actions-row">
            <button
              className="btn-primary"
              onClick={onProceed}
            >
              Proceed
            </button>
            <button
              className="btn-secondary"
              onClick={onManage}
            >
              Manage Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;
