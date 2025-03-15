import logo from "../assets/logo_completo.png";
import "./css/LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <img src={logo} alt="Cargando..." className="loading-logo" />
    </div>
  );
};

export default LoadingScreen;
