import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import authService from "../services/authService";
import "./css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      {/* Sección del logo */}
      <div className="login-left">
        <img
          src={require("../assets/logo_completo.png")}
          alt="Logo"
          className="logo-completo"
        />
      </div>

      {/* Sección del formulario */}
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
        </form>
      </div>
    </div>
  );
};

export default Login;
