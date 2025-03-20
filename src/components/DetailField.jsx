import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "./css/DetailField.css";

const DetailField = ({ label, value, isLongText = false }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isLongText && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isLongText]);

  return (
    <div className="detail-field">
      <label className="detail-label">{label}</label>
      {isLongText ? (
        <textarea
          ref={textareaRef}
          className="detail-input detail-textarea"
          value={value}
          readOnly
        />
      ) : (
        <input className="detail-input" type="text" value={value} readOnly />
      )}
    </div>
  );
};

DetailField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isLongText: PropTypes.bool,
};

export default DetailField;
