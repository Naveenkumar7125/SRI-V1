import { useState } from "react";
import "./operations.css";

const Operations = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "System Check Completed",
      message: "All perimeter cameras are online and streaming correctly.",
      type: "success",
      time: "08:45",
    },
    {
      id: 2,
      title: "Access Request",
      message: "Temporary access requested at Gate 2 – Staff Entry.",
      type: "info",
      time: "09:10",
    },
    {
      id: 3,
      title: "Suspicious Activity",
      message: "Unusual motion detected near Parking Bay – Zone B.",
      type: "warning",
      time: "09:32",
    },
    {
      id: 4,
      title: "Network Latency",
      message: "Minor delay observed in feed from Blind Spot Cam.",
      type: "info",
      time: "09:45",
    },
  ]);

  const getTypeLabel = (type) => {
    if (type === "success") return "Normal";
    if (type === "info") return "Info";
    if (type === "warning") return "Attention";
    if (type === "error") return "Critical";
    return "Info";
  };

  return (
    <div className="notifications-section">
      <div className="notifications-card">
        {/* header */}
        <div className="notifications-header">
          <div className="notifications-header-left">
            <div className="notifications-main-icon">
              <BellIcon />
            </div>
            <div className="notifications-text">
              <h3 className="notifications-title">Notifications</h3>
              <p className="notifications-subtitle">
                Latest security events
              </p>
            </div>
          </div>
          <button className="notifications-chip">
            {notifications.length} new
          </button>
        </div>

        {/* list */}
        <div className="notifications-list">
          {notifications.map((note) => (
            <div key={note.id} className="notification-item">
              <div className={`notification-indicator ${note.type}`} />
              <div className="notification-main">
                <div className="notification-top">
                  <span className="notification-title">{note.title}</span>
                  <span className="notification-time">{note.time}</span>
                </div>
                <p className="notification-message">{note.message}</p>
                <span className={`notification-tag ${note.type}`}>
                  {getTypeLabel(note.type)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* minimal bell icon */
const BellIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17v1.2a2 2 0 1 1-4 0"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Operations;
