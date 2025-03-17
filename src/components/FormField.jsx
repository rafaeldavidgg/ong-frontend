import PropTypes from "prop-types";
import "./css/FormField.css";

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  isRequired = true,
}) => {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        required={isRequired}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default FormField;
