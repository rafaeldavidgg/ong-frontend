import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from "../services/userService";
import { validateField } from "../utils/formValidations";
import { TipoAutismoEnum } from "../utils/tipoAutismoUtils";
import "./css/EditarUsuario.css";

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
    tipoAutismo: "",
    gradoAutismo: "",
    grupoTrabajo: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      const data = await getUsuarioById(id);
      if (data) {
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          dni: data.dni,
          fechaNacimiento: data.fechaNacimiento
            ? new Date(data.fechaNacimiento).toISOString().split("T")[0]
            : "",
          email: data.email,
          contraseña: "********",
          confirmarContraseña: "********",
          tipoAutismo: data.tipoAutismo,
          gradoAutismo: data.gradoAutismo,
          grupoTrabajo: data.grupoTrabajo,
        });
      }
    };
    fetchUsuario();
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
      await deleteUsuario(id);
      setIsModalOpen(false);
      navigate("/usuarios");
    } catch (error) {
      console.error("Error eliminando usuario:", error);
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
      await updateUsuario(id, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.email,
        contraseña: formData.contraseña || undefined,
        tipoAutismo: formData.tipoAutismo,
        gradoAutismo: formData.gradoAutismo,
        grupoTrabajo: formData.grupoTrabajo,
      });
      navigate(`/usuarios/${id}`);
    } catch (error) {
      console.error("Error en la actualización del usuario:", error);
      setErrors({
        general: error.message || "Error al actualizar el usuario",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-usuario-container">
        <PageTitle title="Editar usuario" />

        <form onSubmit={handleSubmit} className="editar-usuario-form">
          <div className="editar-usuario-grid">
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
                label="Fecha nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                name="fechaNacimiento"
              />
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
              <label className="form-label">Tipo autismo</label>
              <select
                className="form-input"
                name="tipoAutismo"
                value={formData.tipoAutismo}
                onChange={handleChange}
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
          message="¿Estás seguro de que deseas eliminar este usuario?"
        />
      </div>
    </>
  );
};

export default EditarUsuario;
