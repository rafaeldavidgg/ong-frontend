import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getEventoById,
  updateEvento,
  deleteEvento,
} from "../services/eventoService";
import { validateField } from "../utils/formValidations";
import "./css/EditarUsuario.css";

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    entradasTotales: 0,
    entradasDisponibles: 0,
    trabajadoresMinimos: 0,
  });
  const [totalSolicitadas, setTotalSolicitadas] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvento = async () => {
      const evento = await getEventoById(id);
      if (evento) {
        const solicitadas =
          evento.entradasSolicitadas?.reduce((sum, e) => sum + e.cantidad, 0) ||
          0;
        setTotalSolicitadas(solicitadas);
        setFormData({
          nombre: evento.nombre,
          descripcion: evento.descripcion,
          fecha: evento.fecha?.split("T")[0] || "",
          entradasTotales: evento.entradasTotales,
          entradasDisponibles: evento.entradasDisponibles,
          trabajadoresMinimos: evento.trabajadoresMinimos,
        });
      }
    };
    fetchEvento();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue =
      name.includes("entradas") || name === "trabajadoresMinimos"
        ? parseInt(value) || 0
        : value;

    if (name === "entradasTotales" && newValue < totalSolicitadas) {
      setErrors((prev) => ({
        ...prev,
        entradasTotales: `No puede ser menor a las entradas ya solicitadas (${totalSolicitadas})`,
      }));
      return;
    }

    const updatedData = {
      ...formData,
      [name]: newValue,
      ...(name === "entradasTotales" && {
        entradasDisponibles: newValue - totalSolicitadas,
      }),
    };

    setFormData(updatedData);

    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = {};
    [
      "nombre",
      "descripcion",
      "fecha",
      "entradasTotales",
      "trabajadoresMinimos",
    ].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateEvento(id, formData);
      navigate(`/eventos/${id}`);
    } catch (error) {
      console.error("Error actualizando evento:", error);
      setErrors({ general: error.message || "Error al actualizar el evento" });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvento(id);
      setIsModalOpen(false);
      navigate("/eventos");
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-usuario-container">
        <PageTitle title="Editar evento" />
        <form onSubmit={handleSubmit} className="editar-usuario-form">
          <div className="editar-usuario-grid">
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
                type="date"
                label="Fecha"
                name="fecha"
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
                isTextArea
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
                value={formData.entradasTotales}
                onChange={handleChange}
              />
              {errors.entradasTotales && (
                <p className="error-text">{errors.entradasTotales}</p>
              )}
            </div>

            <div className="form-field-container">
              <FormField
                label="Trabajadores mínimos"
                name="trabajadoresMinimos"
                type="number"
                value={formData.trabajadoresMinimos}
                onChange={handleChange}
              />
              {errors.trabajadoresMinimos && (
                <p className="error-text">{errors.trabajadoresMinimos}</p>
              )}
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
          message="¿Estás seguro de que deseas eliminar este evento?"
        />
      </div>
    </>
  );
};

export default EditarEvento;
