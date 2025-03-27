import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { createTrabajador } from "../services/trabajadorService";
import { validateField } from "../utils/formValidations";
import { TipoTrabajadorEnum } from "../utils/tipoTrabajadorEnum";
import "./css/CrearTrabajador.css";

const CrearTrabajador = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    fechaIncorporacion: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
    tipo: "",
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

    if (formData.contraseña !== formData.confirmarContraseña) {
      validationErrors.confirmarContraseña = "Las contraseñas no coinciden";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createTrabajador({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        dni: formData.dni,
        fechaIncorporacion: formData.fechaIncorporacion,
        email: formData.email,
        contraseña: formData.contraseña,
        tipo: formData.tipo,
      });
      navigate("/trabajadores");
    } catch (error) {
      console.error("Error en la creación del trabajador:", error);
      setErrors({ general: error.message || "Error al crear el trabajador" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-trabajador-container">
        <PageTitle title="Nuevo trabajador" />

        {errors.general && (
          <div className="error">
            <span>{errors.general}</span>
            <button className="close-error" onClick={() => setErrors({})}>
              ✖
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="crear-trabajador-form">
          <div className="crear-trabajador-grid">
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
                label="Fecha de Incorporación"
                type="date"
                value={formData.fechaIncorporacion}
                onChange={handleChange}
                name="fechaIncorporacion"
              />
            </div>

            <div className="form-field-container">
              <FormField
                label="Email"
                value={formData.email}
                onChange={handleChange}
                name="email"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                name="contraseña"
              />
              {errors.contraseña && (
                <p className="error-text">{errors.contraseña}</p>
              )}
            </div>

            <div className="form-field-container">
              <label className="form-label" htmlFor="tipo">
                Tipo de trabajador
              </label>
              <select
                id="tipo"
                className="form-input"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                {Object.entries(TipoTrabajadorEnum).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.tipo && <p className="error-text">{errors.tipo}</p>}
            </div>

            <div className="form-field-container">
              <FormField
                label="Repetir contraseña"
                type="password"
                value={formData.confirmarContraseña}
                onChange={handleChange}
                name="confirmarContraseña"
              />
              {errors.confirmarContraseña && (
                <p className="error-text">{errors.confirmarContraseña}</p>
              )}
            </div>
          </div>

          <Button text="Crear" type="submit" />
        </form>
      </div>
    </>
  );
};

export default CrearTrabajador;
