import PropTypes from "prop-types";
import "./css/Button.css";

const Button = ({ text, onClick }) => {
  return (
    <button className="btn-primary" onClick={onClick}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
