import React from 'react';
import "./TeamHeader.css";
const TeamHeader = ({ deployedOperativesCount, onDeployClick }) => {
  return (
    <div className="teams-header">
      <div className="header-left">
        <div className="header-icon"></div>
        <div>
          <h1 className="header-title">National Security Guard</h1>
          <p className="header-subtitle">
            Black Cats Commando Force • {deployedOperativesCount} Operatives Deployed
          </p>
        </div>
      </div>
      <button 
        className="nsg-btn primary" 
        onClick={onDeployClick}
      >
        + Deploy Operative
      </button>
    </div>
  );
};

export default TeamHeader;