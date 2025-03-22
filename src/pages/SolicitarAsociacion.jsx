import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { crearSolicitudAsociacion } from "../services/solicitudesService";
import { validateField } from "../utils/formValidations";
import "./css/SolicitarAsociacion.css";

const SolicitarAsociacion = () => {
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateField("dni", dni);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await crearSolicitudAsociacion(user._id, dni);
      navigate("/mis-familiares");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="solicitud-container">
      <Navbar />
      <div className="solicitud-content">
        <PageTitle title="Solicitud de asociación" />

        <div className="solicitud-form-wrapper">
          <form className="solicitud-form" onSubmit={handleSubmit}>
            <label htmlFor="dni" className="solicitud-label">
              Rellene el DNI del usuario
            </label>
            <input
              id="dni"
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="solicitud-input"
              required
            />
            {error && <p className="solicitud-error">{error}</p>}
            <Button text="Enviar" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarAsociacion;
