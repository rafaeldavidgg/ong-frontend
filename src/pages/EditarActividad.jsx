import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import ConfirmModal from "../components/ConfirmModal";
import {
  getActividadById,
  updateActividad,
  deleteActividad,
} from "../services/actividadService";
import { getTipoActividades } from "../services/tipoActividadService";
import { getUsuarios } from "../services/userService";
import { getTrabajadores } from "../services/trabajadorService";
import { validateField } from "../utils/formValidations";
import "./css/EditarUsuario.css";

const EditarActividad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    tipoActividad: "",
    realizadaPor: [],
    ejecutadaPor: [],
  });
  const [tipoActividades, setTipoActividades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customStyles = {
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
    }),
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#104572",
      fontSize: "14px",
      boxShadow: "none",
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "100px",
      overflowY: "auto",
    }),
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const actividad = await getActividadById(id);
      if (actividad) {
        setFormData({
          nombre: actividad.nombre,
          fecha: actividad.fecha?.split("T")[0] || "",
          tipoActividad: actividad.tipoActividad?._id || "",
          realizadaPor: actividad.realizadaPor?.map((u) => u._id) || [],
          ejecutadaPor: actividad.ejecutadaPor?.map((t) => t._id) || [],
        });
      }

      const tipos = await getTipoActividades(1, 100);
      const usus = await getUsuarios(1, 100);
      const trabs = await getTrabajadores(1, 100);

      setTipoActividades(tipos.tipoActividades);
      setUsuarios(usus.usuarios);
      setTrabajadores(trabs.trabajadores);
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

  const handleSelectChange = (selectedOptions, name, fullList) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setFormData({ ...formData, [name]: [] });
      return;
    }

    const hasAll = selectedOptions.some((opt) => opt.value === "ALL");
    const allValues = fullList.map((item) => item._id);

    if (hasAll) {
      const isAlreadyAll =
        formData[name].length === fullList.length &&
        fullList.every((item) => formData[name].includes(item._id));

      setFormData({
        ...formData,
        [name]: isAlreadyAll ? [] : allValues,
      });
    } else {
      setFormData({
        ...formData,
        [name]: selectedOptions.map((opt) => opt.value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = {};
    ["nombre", "fecha", "tipoActividad"].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateActividad(id, formData);
      navigate(`/actividades/${id}`);
    } catch (error) {
      console.error("Error actualizando actividad:", error);
      setErrors({
        general: error.message || "Error al actualizar la actividad",
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteActividad(id);
      setIsModalOpen(false);
      navigate("/actividades");
    } catch (error) {
      console.error("Error eliminando actividad:", error);
    }
  };

  const auxiliares = trabajadores.filter((t) => t.tipo === "Auxiliar");
  const allOption = { value: "ALL", label: "Seleccionar todos" };

  const buildOptionsWithAll = (items, getLabel) => [
    allOption,
    ...items.map((item) => ({ value: item._id, label: getLabel(item) })),
  ];

  return (
    <>
      <Navbar />
      <div className="editar-usuario-container">
        <PageTitle title="Editar actividad" />

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
                label="Fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
              {errors.fecha && <p className="error-text">{errors.fecha}</p>}
            </div>

            <div className="form-field-container">
              <label className="form-label" htmlFor="tipoActividad">
                Tipo de actividad
              </label>
              <select
                id="tipoActividad"
                name="tipoActividad"
                className="form-input"
                value={formData.tipoActividad}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                {tipoActividades.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.nombreTipo}
                  </option>
                ))}
              </select>
              {errors.tipoActividad && (
                <p className="error-text">{errors.tipoActividad}</p>
              )}
            </div>

            <div className="form-field-container">
              <label className="form-label" htmlFor="realizadaPor">
                Usuarios participantes
              </label>
              <Select
                inputId="realizadaPor"
                isMulti
                name="realizadaPor"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Seleccione uno o varios"
                noOptionsMessage={() => "No hay usuarios creados"}
                options={buildOptionsWithAll(
                  usuarios,
                  (u) => `${u.nombre} ${u.apellido}`
                )}
                value={usuarios
                  .filter((u) => formData.realizadaPor.includes(u._id))
                  .map((u) => ({
                    value: u._id,
                    label: `${u.nombre} ${u.apellido}`,
                  }))}
                onChange={(selected) =>
                  handleSelectChange(selected, "realizadaPor", usuarios)
                }
              />
            </div>

            <div className="form-field-container">
              <label className="form-label" htmlFor="ejecutadaPor">
                Ejecutada por (auxiliares)
              </label>
              <Select
                inputId="ejecutadaPor"
                isMulti
                name="ejecutadaPor"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Seleccione uno o varios"
                noOptionsMessage={() => "No hay auxiliares creados"}
                options={buildOptionsWithAll(
                  auxiliares,
                  (t) => `${t.nombre} ${t.apellido}`
                )}
                value={auxiliares
                  .filter((t) => formData.ejecutadaPor.includes(t._id))
                  .map((t) => ({
                    value: t._id,
                    label: `${t.nombre} ${t.apellido}`,
                  }))}
                onChange={(selected) =>
                  handleSelectChange(selected, "ejecutadaPor", auxiliares)
                }
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
          message="¿Estás seguro de que deseas eliminar esta actividad?"
        />
      </div>
    </>
  );
};

export default EditarActividad;
