import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getIncidenciaById,
  updateIncidencia,
  deleteIncidencia,
} from "../services/incidenciaService";
import { getUsuarios } from "../services/userService";
import { validateField } from "../utils/formValidations";
import "./css/EditarUsuario.css";

const tipoOpciones = [
  { value: "AGITACION", label: "Agitación" },
  { value: "AGRESION_VERBAL", label: "Agresión verbal" },
  { value: "AGRESION_FISICA", label: "Agresión física" },
  { value: "AUTOLESION", label: "Autolesión" },
  { value: "SOBRECARGA_SENSORIAL", label: "Sobrecarga sensorial" },
  { value: "OTRO", label: "Otro" },
];

const EditarIncidencia = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: "",
    tipoIncidencia: "",
    descripcion: "",
    usuario: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const incidencia = await getIncidenciaById(id);
      if (incidencia) {
        setFormData({
          fecha: incidencia.fecha?.split("T")[0] || "",
          tipoIncidencia: incidencia.tipoIncidencia || "",
          descripcion: incidencia.descripcion || "",
          usuario: incidencia.usuario?._id || "",
        });
      }

      const usus = await getUsuarios(1, 100);
      setUsuarios(usus.usuarios);
    };

    fetchInitialData();
  }, [id]);

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
      await updateIncidencia(id, formData);
      navigate(`/incidencias/${id}`);
    } catch (error) {
      console.error("Error actualizando incidencia:", error);
      setErrors({
        general: error.message || "Error al actualizar la incidencia",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteIncidencia(id);
      setIsModalOpen(false);
      navigate("/incidencias");
    } catch (error) {
      console.error("Error eliminando incidencia:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-usuario-container">
        <PageTitle title="Editar incidencia" />

        <form onSubmit={handleSubmit} className="editar-usuario-form">
          <div className="editar-usuario-grid">
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

          <div className="editar-usuario-buttons">
            <button
              type="button"
              className="delete-button"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bi bi-trash"></i>
            </button>
            <button type="submit" className="save-button">
              Guardar
            </button>
          </div>
        </form>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message="¿Estás seguro de que deseas eliminar esta incidencia?"
        />
      </div>
    </>
  );
};

export default EditarIncidencia;
