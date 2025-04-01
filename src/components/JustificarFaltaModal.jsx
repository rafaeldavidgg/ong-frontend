import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { updateAsistencia } from "../services/asistenciaService";
import { formatDate } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import "./css/AsistenciaModal.css";
import "./css/FormField.css";

const JustificarFaltaModal = ({ isOpen, onClose, asistencia, onSuccess }) => {
  const { user } = useAuth();
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDescripcion("");
      setError(null);
    }
  }, [isOpen]);

  const handleGuardar = async () => {
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateAsistencia(asistencia._id, {
        descripcion,
        justificada: true,
        justificadaPor: user._id,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !asistencia) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Justificar falta</h2>
        <p className="modal-subtitle">
          {asistencia.usuario?.nombre} {asistencia.usuario?.apellido} -{" "}
          {formatDate(asistencia.fecha)}
        </p>

        <div className="form-field">
          <label htmlFor="descripcion" className="form-label">
            Descripción:
          </label>
          <textarea
            id="descripcion"
            className="form-input"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
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
            {loading ? "Guardando..." : "Justificar"}
          </button>
        </div>
      </div>
    </div>
  );
};

JustificarFaltaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  asistencia: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default JustificarFaltaModal;
