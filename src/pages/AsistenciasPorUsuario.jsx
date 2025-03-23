import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getAsistenciasByUsuario } from "../services/asistenciaService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import JustificarFaltaModal from "../components/JustificarFaltaModal";
import { formatDate } from "../utils/dateUtils";
import "./css/Asistencias.css";

const AsistenciasPorUsuario = () => {
  const { usuarioId } = useParams();
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchAsistencias = useCallback(async () => {
    setLoading(true);
    const data = await getAsistenciasByUsuario(
      usuarioId,
      currentPage,
      10,
      debouncedSearchTerm
    );
    const soloFaltas = data.asistencias.filter((a) => !a.presente);
    setAsistencias(soloFaltas);
    setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
    if (soloFaltas.length > 0 && soloFaltas[0].usuario) {
      setNombreUsuario(
        `${soloFaltas[0].usuario.nombre} ${
          soloFaltas[0].usuario.apellido || ""
        }`
      );
    }
    setLoading(false);
  }, [usuarioId, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  const openModal = (asistencia) => {
    setSelectedAsistencia(asistencia);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAsistencia(null);
    setModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="asistencias-container">
        <PageTitle
          title={nombreUsuario ? `Faltas de ${nombreUsuario}` : "Faltas"}
        />

        <div className="asistencias-header">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {!loading && (
          <>
            <DataTable
              columns={["", "Fecha", "Justificada", "Descripción"]}
              data={asistencias.map((a) => ({
                key: a._id,
                row: [
                  <button
                    key={`view-${a._id}`}
                    className="view-btn"
                    onClick={() => openModal(a)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>,
                  <span key={`fecha-${a._id}`}>{formatDate(a.fecha)}</span>,
                  <span key={`justificada-${a._id}`}>
                    <i
                      className={`bi ${
                        a.justificada ? "bi-check-circle" : "bi-x-circle"
                      }`}
                      style={{
                        fontSize: "1.5rem",
                        color: a.justificada ? "green" : "#E57373",
                      }}
                    ></i>
                  </span>,
                  <span key={`descripcion-${a._id}`}>
                    {a.descripcion || "-"}
                  </span>,
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

        <JustificarFaltaModal
          isOpen={modalOpen}
          onClose={closeModal}
          asistencia={selectedAsistencia}
          onSuccess={fetchAsistencias}
        />
      </div>
    </>
  );
};

export default AsistenciasPorUsuario;
