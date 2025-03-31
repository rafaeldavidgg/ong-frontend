import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { createIncidencia } from "../services/incidenciaService";
import { getUsuarios } from "../services/userService";
import { validateField } from "../utils/formValidations";
import "./css/CrearUsuario.css";

const CrearIncidencia = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: "",
    tipoIncidencia: "",
    descripcion: "",
    usuario: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const tipoOpciones = [
    { value: "AGITACION", label: "Agitación" },
    { value: "AGRESION_VERBAL", label: "Agresión verbal" },
    { value: "AGRESION_FISICA", label: "Agresión física" },
    { value: "AUTOLESION", label: "Autolesión" },
    { value: "SOBRECARGA_SENSORIAL", label: "Sobrecarga sensorial" },
    { value: "OTRO", label: "Otro" },
  ];

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usus = await getUsuarios(1, 100);
      setUsuarios(usus.usuarios);
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    const validationErrors = {};
    ["fecha", "tipoIncidencia", "usuario"].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createIncidencia({
        ...formData,
        creadaPor: user._id,
      });
      navigate("/incidencias");
    } catch (error) {
      console.error("Error al crear incidencia:", error);
      setErrors({ general: error.message || "Error al crear la incidencia" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="crear-usuario-container">
        <PageTitle title="Nueva incidencia" />

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="crear-usuario-grid">
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
              <label className="form-label" htmlFor="tipoIncidencia">
                Tipo de incidencia
              </label>
              <select
                id="tipoIncidencia"
                name="tipoIncidencia"
                className="form-input"
                value={formData.tipoIncidencia}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                {tipoOpciones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              {errors.tipoIncidencia && (
                <p className="error-text">{errors.tipoIncidencia}</p>
              )}
            </div>

            <div className="form-field-container">
              <label className="form-label" htmlFor="usuario">
                Usuario implicado
              </label>
              <select
                id="usuario"
                name="usuario"
                className="form-input"
                value={formData.usuario}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona un usuario
                </option>
                {usuarios.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </select>
              {errors.usuario && <p className="error-text">{errors.usuario}</p>}
            </div>

            <div
              className="form-field-container"
              style={{ gridColumn: "1/-1" }}
            >
              <FormField
                label="Descripción (opcional)"
                name="descripcion"
                type="textarea"
                value={formData.descripcion}
                onChange={handleChange}
                isRequired={false}
              />
            </div>
          </div>

          {errors.general && <p className="error-text">{errors.general}</p>}

          <Button text="Crear" type="submit" />
        </form>
      </div>
    </>
  );
};

export default CrearIncidencia;
