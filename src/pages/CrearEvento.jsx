import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { createEvento } from "../services/eventoService";
import { validateField } from "../utils/formValidations";
import { useAuth } from "../context/AuthContext";
import "./css/CrearUsuario.css";

const CrearEvento = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    entradasTotales: "",
    trabajadoresMinimos: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const requiredFields = [
      "nombre",
      "descripcion",
      "fecha",
      "entradasTotales",
      "trabajadoresMinimos",
    ];
    const validationErrors = {};

    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createEvento({
        ...formData,
        entradasTotales: parseInt(formData.entradasTotales),
        trabajadoresMinimos: parseInt(formData.trabajadoresMinimos),
        creadoPor: user._id,
      });

      navigate("/eventos");
    } catch (error) {
      console.error("Error al crear evento:", error);
      setErrors({ general: error.message || "Error al crear el evento" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-usuario-container">
        <PageTitle title="Nuevo evento" />

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="crear-usuario-grid">
            <div className="form-field-container">
              <FormField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
              />
              {errors.fecha && <p className="error-text">{errors.fecha}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                type="textarea"
              />
              {errors.descripcion && (
                <p className="error-text">{errors.descripcion}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Entradas totales"
                name="entradasTotales"
                type="number"
                min="1"
                value={formData.entradasTotales}
                onChange={handleChange}
              />
              {errors.entradasTotales && (
                <p className="error-text">{errors.entradasTotales}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Trabajadores mínimos requeridos"
                name="trabajadoresMinimos"
                type="number"
                min="1"
                value={formData.trabajadoresMinimos}
                onChange={handleChange}
              />
              {errors.trabajadoresMinimos && (
                <p className="error-text">{errors.trabajadoresMinimos}</p>
              )}
            </div>
          </div>

          {errors.general && <p className="error-text">{errors.general}</p>}

          <Button text="Crear" type="submit" />
        </form>
      </div>
    </>
  );
};

export default CrearEvento;
