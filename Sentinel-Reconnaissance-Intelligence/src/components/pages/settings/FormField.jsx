const FormField = ({ label, children, full }) => (
  <div className={`form-group ${full ? "full-width" : ""}`}>
    <label>{label}</label>
    {children}
  </div>
);

export default FormField;
