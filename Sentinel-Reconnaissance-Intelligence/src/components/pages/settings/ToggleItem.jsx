const ToggleItem = ({ label, description, checked, onChange }) => (
  <div className="toggle-item">
    <div className="toggle-info">
      <span className="toggle-label">{label}</span>
      <span className="toggle-description">{description}</span>
    </div>

    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  </div>
);

export default ToggleItem;
