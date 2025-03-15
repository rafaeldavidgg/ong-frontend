import { useNavigate } from "react-router-dom";
import ButtonSecondary from "../components/ButtonSecondary";
import "./css/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <ButtonSecondary
        text="Volver al inicio"
        onClick={() => navigate("/home")}
      />
    </div>
  );
};

export default NotFound;
