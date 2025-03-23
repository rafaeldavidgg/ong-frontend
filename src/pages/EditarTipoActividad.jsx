import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getTipoActividadById,
  updateTipoActividad,
  deleteTipoActividad,
} from "../services/tipoActividadService";
import { validateField } from "../utils/formValidations";
import "./css/EditarUsuario.css";

const EditarTipoActividad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreTipo: "",
    descripcion: "",
    duracion: "",
    materiales: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTipoActividad = async () => {
      const data = await getTipoActividadById(id);
      if (data) {
        setFormData({
          nombreTipo: data.nombreTipo,
          descripcion: data.descripcion || "",
          duracion: data.duracion,
          materiales: data.materiales || "",
        });
      }
    };
    fetchTipoActividad();
  }, [id]);

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

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTipoActividad(id);
      setIsModalOpen(false);
      navigate("/tipo-actividades");
    } catch (error) {
      console.error("Error eliminando tipo de actividad:", error);
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
      await updateTipoActividad(id, formData);
      navigate(`/tipo-actividades/${id}`);
    } catch (error) {
      console.error("Error actualizando tipo de actividad:", error);
      setErrors({
        general: error.message || "Error al actualizar el tipo de actividad",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-usuario-container">
        <PageTitle title="Editar tipo de actividad" />

        <form onSubmit={handleSubmit} className="editar-usuario-form">
          <div className="editar-usuario-grid">
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

          <div className="editar-usuario-buttons">
            <button
              type="button"
              className="delete-button"
              onClick={handleDeleteClick}
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
          message="¿Estás seguro de que deseas eliminar este tipo de actividad?"
        />
      </div>
    </>
  );
};

export default EditarTipoActividad;
