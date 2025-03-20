import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createAsistencia } from "../services/asistenciaService";
import { getUsuarioById } from "../services/userService";
import "./css/AsistenciaModal.css";
import "./css/FormField.css";

const AsistenciaModal = ({ isOpen, onClose, usuarioId, onSuccess }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioNombre, setUsuarioNombre] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError(null);

      if (usuarioId) {
        getUsuarioById(usuarioId)
          .then((data) => setUsuarioNombre(`${data.nombre} ${data.apellido}`))
          .catch(() => setUsuarioNombre(""));
      }
    }
  }, [isOpen, usuarioId]);

  const handleGuardar = async () => {
    setLoading(true);
    setError(null);

    const asistenciaData = {
      fecha: new Date(fecha).toISOString(),
      presente: false,
      justificada: false,
      descripcion: null,
      usuario: usuarioId,
      justificadaPor: null,
    };

    try {
      await createAsistencia(asistenciaData);
      onSuccess();
      onClose();
    } catch (error) {
      setError("No se pudo registrar la asistencia.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Falta de:</h2>
        {usuarioNombre && <h3 className="modal-subtitle">{usuarioNombre}</h3>}

        <div className="form-field">
          <label htmlFor="fecha" className="form-label">
            Fecha:
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-modal-primary"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

AsistenciaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuarioId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default AsistenciaModal;
