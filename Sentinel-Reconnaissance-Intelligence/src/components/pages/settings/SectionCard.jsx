const SectionCard = ({ title, children }) => (
  <div className="settings-group">
    <h3>{title}</h3>
    {children}
  </div>
);

export default SectionCard;
