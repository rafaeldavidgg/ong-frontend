import PropTypes from "prop-types";
import "./css/ConfirmModal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, confirmType = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`confirm-button ${
              confirmType === "aceptar" ? "confirm-accept" : "confirm-reject"
            }`}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  confirmType: PropTypes.oneOf(["aceptar", "rechazar", ""]),
};

export default ConfirmModal;
