import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { createActividad } from "../services/actividadService";
import { getTipoActividades } from "../services/tipoActividadService";
import { getUsuarios } from "../services/userService";
import { getTrabajadores } from "../services/trabajadorService";
import { validateField } from "../utils/formValidations";
import { useAuth } from "../context/AuthContext";
import "./css/CrearUsuario.css";

const CrearActividad = () => {
  const { user } = useAuth();
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
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
    const fetchData = async () => {
      const tipos = await getTipoActividades(1, 100);
      const usus = await getUsuarios(1, 100);
      const trabs = await getTrabajadores(1, 100);

      setTipoActividades(tipos.tipoActividades);
      setUsuarios(usus.usuarios);
      setTrabajadores(trabs.trabajadores);
    };
    fetchData();
  }, []);

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
    ["nombre", "fecha", "tipoActividad"].forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) validationErrors[key] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createActividad({
        ...formData,
        creadaPor: user._id,
      });
      navigate("/actividades");
    } catch (error) {
      console.error("Error al crear actividad:", error);
      setErrors({ general: error.message || "Error al crear la actividad" });
    }
  };

  const allOption = { value: "ALL", label: "Seleccionar todos" };

  const buildOptionsWithAll = (items, getLabel) => [
    allOption,
    ...items.map((item) => ({
      value: item._id,
      label: getLabel(item),
    })),
  ];

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

  const auxiliares = trabajadores.filter((t) => t.tipo === "Auxiliar");

  return (
    <>
      <Navbar />
      <div className="crear-usuario-container">
        <PageTitle title="Nueva actividad" />

        <form onSubmit={handleSubmit} className="crear-usuario-form">
          <div className="crear-usuario-grid">
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
                name="fecha"
                type="date"
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
                required
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
                styles={customStyles}
                classNamePrefix="select"
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
                Ejecutada por
              </label>
              <Select
                inputId="ejecutadaPor"
                isMulti
                name="ejecutadaPor"
                styles={customStyles}
                classNamePrefix="select"
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

          <Button text="Crear" type="submit" />
        </form>
      </div>
    </>
  );
};

export default CrearActividad;
