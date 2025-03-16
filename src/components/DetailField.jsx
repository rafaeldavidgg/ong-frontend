import PropTypes from "prop-types";
import "./css/DetailField.css";

const DetailField = ({ label, value }) => {
  return (
    <div className="detail-field">
      <label className="detail-label">{label}</label>
      <input className="detail-input" type="text" value={value} readOnly />
    </div>
  );
};

DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DetailField;
