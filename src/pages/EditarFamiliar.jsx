import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getFamiliarById,
  updateFamiliar,
  deleteFamiliar,
} from "../services/familiarService";
import { validateField } from "../utils/formValidations";
import "./css/EditarFamiliar.css";

const EditarFamiliar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    dni: "",
    tipoDeRelacionConUsuario: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchFamiliar = async () => {
      const data = await getFamiliarById(id);
      if (data) {
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          dni: data.dni,
          tipoDeRelacionConUsuario: data.tipoDeRelacionConUsuario,
          email: data.email,
          contraseña: "********",
          confirmarContraseña: "********",
        });
      }
    };
    fetchFamiliar();
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
      await deleteFamiliar(id);
      setIsModalOpen(false);
      navigate("/familiares");
    } catch (error) {
      console.error("Error eliminando familiar:", error);
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
      await updateFamiliar(id, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        dni: formData.dni,
        tipoDeRelacionConUsuario: formData.tipoDeRelacionConUsuario,
        email: formData.email,
        contraseña: formData.contraseña || undefined,
      });
      navigate(`/familiares/${id}`);
    } catch (error) {
      console.error("Error en la actualización del familiar:", error);
      setErrors({
        general: error.message || "Error al actualizar el familiar",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="editar-familiar-container">
        <PageTitle title="Editar familiar" />

        {errors.general && (
          <div className="error">
            <span>{errors.general}</span>
            <button className="close-error" onClick={() => setErrors({})}>
              ✖
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="editar-familiar-form">
          <div className="editar-familiar-grid">
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
                label="Relación con usuario"
                value={formData.tipoDeRelacionConUsuario}
                onChange={handleChange}
                name="tipoDeRelacionConUsuario"
                isRequired={false}
              />
              {errors.tipoDeRelacionConUsuario && (
                <p className="error-text">{errors.tipoDeRelacionConUsuario}</p>
              )}
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
              {errors.contraseña && (
                <p className="error-text">{errors.contraseña}</p>
              )}
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
              {errors.confirmarContraseña && (
                <p className="error-text">{errors.confirmarContraseña}</p>
              )}
            </div>
          </div>

          <div className="editar-familiar-buttons">
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
          message="¿Estás seguro de que deseas eliminar este familiar?"
        />
      </div>
    </>
  );
};

export default EditarFamiliar;
