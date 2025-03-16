import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./css/AddButton.css";

const AddButton = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button className="add-btn" onClick={() => navigate(to)}>
      <i className="bi bi-plus-lg"></i>
    </button>
  );
};

AddButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default AddButton;
