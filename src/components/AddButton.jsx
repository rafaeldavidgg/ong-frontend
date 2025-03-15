import { useNavigate } from "react-router-dom";
import "./css/AddButton.css";

const AddButton = () => {
  const navigate = useNavigate();

  return (
    <button className="add-btn" onClick={() => navigate("/crear-usuario")}>
      <i className="bi bi-plus-lg"></i>
    </button>
  );
};

export default AddButton;
