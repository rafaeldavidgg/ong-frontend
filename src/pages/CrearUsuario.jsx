import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { createUsuario } from "../services/userService";
import { TipoAutismoEnum } from "../utils/tipoAutismoUtils";
import { validateField } from "../utils/formValidations";
import "./css/CrearUsuario.css";

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    tipoAutismo: "",
    gradoAutismo: "",
    grupoTrabajo: "",
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
      await createUsuario(formData);
      navigate("/usuarios");
    } catch (error) {
      console.error("Error en la creación del usuario:", error);
      setErrors({ general: error.message || "Error al crear el usuario" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-usuario-container">
        <PageTitle title="Nuevo usuario" />

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="crear-usuario-grid">
            <div className="form-field-container">
              <FormField
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                name="nombre"
              />
              {errors.nombre && <p className="error-text">{errors.nombre}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Apellidos"
                value={formData.apellido}
                onChange={handleChange}
                name="apellido"
              />
              {errors.apellido && (
                <p className="error-text">{errors.apellido}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                name="telefono"
              />
              {errors.telefono && (
                <p className="error-text">{errors.telefono}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="DNI"
                value={formData.dni}
                onChange={handleChange}
                name="dni"
              />
              {errors.dni && <p className="error-text">{errors.dni}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Fecha nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                name="fechaNacimiento"
              />
            </div>

            <div className="form-field-container">
              <div className="form-field">
                <label className="form-label" htmlFor="tipoAutismo">
                  Tipo autismo
                </label>
                <select
                  id="tipoAutismo"
                  className="form-input"
                  name="tipoAutismo"
                  value={formData.tipoAutismo}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecciona un tipo
                  </option>
                  {Object.entries(TipoAutismoEnum).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.tipoAutismo && (
                <p className="error-text">{errors.tipoAutismo}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Grado autismo (%)"
                value={formData.gradoAutismo}
                onChange={handleChange}
                name="gradoAutismo"
              />
              {errors.gradoAutismo && (
                <p className="error-text">{errors.gradoAutismo}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Grupo trabajo"
                value={formData.grupoTrabajo}
                onChange={handleChange}
                name="grupoTrabajo"
              />
              {errors.grupoTrabajo && (
                <p className="error-text">{errors.grupoTrabajo}</p>
              )}
            </div>
          </div>

          <Button text="Crear" type="submit" />
        </form>
      </div>
    </>
  );
};

export default CrearUsuario;
