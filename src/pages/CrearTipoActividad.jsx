import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { createTipoActividad } from "../services/tipoActividadService";
import { validateField } from "../utils/formValidations";
import "./css/CrearUsuario.css";

const CrearTipoActividad = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreTipo: "",
    descripcion: "",
    duracion: "",
    materiales: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (submitted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createTipoActividad(formData);
      navigate("/tipo-actividades");
    } catch (error) {
      console.error("Error en la creación del tipo de actividad:", error);
      setErrors({
        general: error.message || "Error al crear el tipo de actividad",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-usuario-container">
        <PageTitle title="Nuevo tipo de actividad" />

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="crear-usuario-grid">
            <div className="form-field-container">
              <FormField
                label="Nombre"
                value={formData.nombreTipo}
                onChange={handleChange}
                name="nombreTipo"
              />
              {errors.nombreTipo && (
                <p className="error-text">{errors.nombreTipo}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Duración (min)"
                value={formData.duracion}
                onChange={handleChange}
                name="duracion"
                type="number"
              />
              {errors.duracion && (
                <p className="error-text">{errors.duracion}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                name="descripcion"
              />
              {errors.descripcion && (
                <p className="error-text">{errors.descripcion}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Materiales"
                value={formData.materiales}
                onChange={handleChange}
                name="materiales"
              />
              {errors.materiales && (
                <p className="error-text">{errors.materiales}</p>
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

export default CrearTipoActividad;
