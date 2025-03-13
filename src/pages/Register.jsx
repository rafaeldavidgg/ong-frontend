import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Button from "../components/Button";
import "./css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await authService.register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        dni: formData.dni,
        email: formData.email,
        contraseña: formData.contraseña,
      });

      if (response) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Error en el registro.");
    }
  };

  return (
    <div className="register-container">
      <img
        src={require("../assets/logo_completo.png")}
        alt="Logo"
        className="register-logo"
      />

      <div className="register-content">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Registro</h2>
          {error && (
            <div className="error">
              <span>{error}</span>
              <button className="close-error" onClick={() => setError("")}>
                ✖
              </button>
            </div>
          )}

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmarContraseña"
            placeholder="Confirmar contraseña"
            value={formData.confirmarContraseña}
            onChange={handleChange}
            required
          />
          <Button text="Registrarse" />
        </form>
      </div>
    </div>
  );
};

export default Register;
