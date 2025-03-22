import { useEffect, useState, useCallback } from "react";
import {
  getSolicitudes,
  aceptarSolicitud,
  rechazarSolicitud,
} from "../services/solicitudesService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import ConfirmModal from "../components/ConfirmModal";
import "./css/Solicitudes.css";

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    const data = await getSolicitudes(currentPage, 10, debouncedSearchTerm);
    setSolicitudes(data.solicitudes);
    setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
    setLoading(false);
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const openModal = (action, id) => {
    setModalAction(action);
    setSelectedId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setSelectedId(null);
  };

  const handleConfirm = async () => {
    if (modalAction === "aceptar") {
      await aceptarSolicitud(selectedId);
    } else if (modalAction === "rechazar") {
      await rechazarSolicitud(selectedId);
    }
    closeModal();
    fetchSolicitudes();
  };

  return (
    <>
      <Navbar />
      <div className="solicitudes-container">
        <PageTitle title="Solicitudes" />

        <div className="solicitudes-header">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {!loading && (
          <>
            <DataTable
              columns={["#", "Familiar", "Usuario", "Teléfono", "Acciones"]}
              data={solicitudes.map((s, index) => ({
                key: s._id,
                row: [
                  <span key={`index-${s._id}`}>
                    {(currentPage - 1) * 10 + index + 1}
                  </span>,
                  <span key={`familiar-${s._id}`}>
                    {s.familiar?.nombre} {s.familiar?.apellido}
                  </span>,
                  <span key={`usuario-${s._id}`}>
                    {s.usuario?.nombre} {s.usuario?.apellido} <br />(
                    {s.usuario?.dni})
                  </span>,
                  <span key={`telefono-${s._id}`}>{s.familiar?.telefono}</span>,
                  <div
                    key={`acciones-${s._id}`}
                    className="solicitudes-actions"
                  >
                    <button
                      className="btn-aceptar"
                      onClick={() => openModal("aceptar", s._id)}
                      title="Aceptar"
                    >
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => openModal("rechazar", s._id)}
                      title="Rechazar"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>,
                ],
              }))}
            />

            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
        <ConfirmModal
          isOpen={modalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          message={
            modalAction === "aceptar"
              ? "¿Estás seguro de que quieres aceptar esta solicitud?"
              : "¿Estás seguro de que quieres rechazar esta solicitud?"
          }
          confirmType={modalAction}
        />
      </div>
    </>
  );
};

export default Solicitudes;
