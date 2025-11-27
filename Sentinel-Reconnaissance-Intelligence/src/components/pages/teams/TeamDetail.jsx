import React from 'react';
import OperativesGrid from './OperativesGrid';
import "./TeamDetail.css";

const TeamDetail = ({
  currentGroup,
  onBack,
  filteredOperatives,
  searchQuery,
  onSearchChange,
  getStatusColor,
  onContactOperative,
  onDeploy
}) => {
  return (
    <div className="team-detail-wrapper">

      {/* Fixed Header */}
      <div className="navigation-bar">
        <button className="back-button" onClick={onBack}>
          ← Back to All Groups
        </button>
        <div className="breadcrumb">
          NSG Teams → <strong>{currentGroup.name}</strong>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="team-content-section">
        <div className="team-header-simple">
          <div className="team-header-content">
            <div className="team-main-icon">{currentGroup.icon}</div>
            <div>
              <h2 className="team-main-name">{currentGroup.name}</h2>
              <p className="team-main-description">{currentGroup.description}</p>
              <div className="team-contact-info">
                <span> {currentGroup.location}</span>
                <span> {currentGroup.phone}</span>
                <span>{currentGroup.contact}</span>
              </div>
            </div>
          </div>
        </div>

        <OperativesGrid
          filteredOperatives={filteredOperatives}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          getStatusColor={getStatusColor}
          onContactOperative={onContactOperative}
          onDeploy={onDeploy}
        />
      </div>

    </div>
  );
};

export default TeamDetail;
