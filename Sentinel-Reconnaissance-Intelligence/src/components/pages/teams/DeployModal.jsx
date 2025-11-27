import React from 'react';
import "./DeployModal.css";
const DeployModal = ({
  show,
  onClose,
  newOperative,
  onOperativeChange,
  nsgGroups,
  onAddOperative
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Deploy New Operative</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={newOperative.name}
                onChange={(e) => onOperativeChange({...newOperative, name: e.target.value})}
                placeholder="Enter operative's full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select
                className="form-input"
                value={newOperative.role}
                onChange={(e) => onOperativeChange({...newOperative, role: e.target.value})}
              >
                <option value="">Select Role</option>
                <option value="Commander">Commander</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Assault Specialist">Assault Specialist</option>
                <option value="Sniper">Sniper</option>
                <option value="Medic">Medic</option>
                <option value="Tech Specialist">Tech Specialist</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">NSG Group *</label>
              <select
                className="form-input"
                value={newOperative.group}
                onChange={(e) => onOperativeChange({...newOperative, group: e.target.value})}
              >
                <option value="">Select Group</option>
                {nsgGroups.map(group => (
                  <option key={group.id} value={group.code}>
                    {group.code} - {group.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={newOperative.status}
                onChange={(e) => onOperativeChange({...newOperative, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="training">Training</option>
                <option value="off-duty">Off Duty</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="nsg-btn outline" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="nsg-btn primary" 
              onClick={onAddOperative}
            >
              Deploy Operative
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;