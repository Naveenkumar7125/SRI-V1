import React from 'react';
import "./GroupsGrid.css";
const GroupsGrid = ({ nsgGroups, getActiveOperativesCount, onContact, onViewTeam }) => {
  return (
    <div className="groups-grid">
      {nsgGroups.map((group) => (
        <div key={group.id} className={`group-card ${group.color}`}>
          <div className="group-icon">{group.icon}</div>
          <div className="group-content">
            <div className="group-header">
              <h3 className="group-code">{group.code}</h3>
              <span className="active-badge">
                {getActiveOperativesCount(group.code)} Active
              </span>
            </div>
            <h4 className="group-name">{group.name}</h4>
            <p className="group-specialization">{group.specialization}</p>
            <p className="group-description">{group.description}</p>
            <div className="group-actions">
              <button 
                className="nsg-btn outline small"
                onClick={() => onContact(group)}
              >
                 Contact
              </button>
              <button 
                className="nsg-btn primary small" 
                onClick={() => onViewTeam(group.code)}
              >
                 View Team
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsGrid;