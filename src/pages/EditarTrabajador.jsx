import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getTrabajadorById,
  updateTrabajador,
  deleteTrabajador,
} from "../services/trabajadorService";
import { validateField } from "../utils/formValidations";
import "./css/EditarTrabajador.css";

const EditarTrabajador = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchTrabajador = async () => {
      const data = await getTrabajadorById(id);
      if (data) {
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          dni: data.dni,
          fechaIncorporacion: data.fechaIncorporacion
            ? new Date(data.fechaIncorporacion).toISOString().split("T")[0]
            : "",
          email: data.email,
          contraseña: "********",
          confirmarContraseña: "********",
          tipo: data.tipo,
        });
      }
    };
    fetchTrabajador();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "*******" ? "" : value,
    });

    if (submitted) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value, true),
      }));
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTrabajador(id);
      setIsModalOpen(false);
      navigate("/trabajadores");
    } catch (error) {
      console.error("Error eliminando trabajador:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], true);
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
      await updateTrabajador(id, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        dni: formData.dni,
        fechaIncorporacion: formData.fechaIncorporacion,
        email: formData.email,
        contraseña: formData.contraseña || undefined,
        tipo: formData.tipo,
      });
      navigate(`/trabajadores/${id}`);
    } catch (error) {
      console.error("Error en la actualización del trabajador:", error);
      setErrors({
        general: error.message || "Error al actualizar el trabajador",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-trabajador-container">
        <PageTitle title="Editar trabajador" />

        <form onSubmit={handleSubmit} className="editar-trabajador-form">
          <div className="editar-trabajador-grid">
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
                label="Contraseña (opcional)"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                name="contraseña"
                isRequired={false}
              />
            </div>

            <div className="form-field-container">
              <FormField
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmarContraseña}
                onChange={handleChange}
                name="confirmarContraseña"
                isRequired={false}
              />
            </div>
          </div>

          <div className="editar-trabajador-buttons">
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
          message="¿Estás seguro de que deseas eliminar este trabajador?"
        />
      </div>
    </>
  );
};

export default EditarTrabajador;
