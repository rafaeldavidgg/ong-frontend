import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import authService from "../services/authService";
import "./css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      login(data.usuario, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src={require("../assets/logo_completo.png")}
          alt="Logo"
          className="logo-completo"
        />
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          {error && (
            <div className="error">
              <span>{error}</span>
              <button className="close-error" onClick={() => setError("")}>
                ✖
              </button>
            </div>
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button text="Ingresar" />

          <div className="register-link">
            <span>¿No tienes cuenta?</span>
            <ButtonSecondary
              text="Regístrate"
              onClick={() => navigate("/register")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
