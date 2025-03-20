import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAsistencias } from "../services/asistenciaService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import { formatDate } from "../utils/dateUtils";
import "./css/Asistencias.css";

const Asistencias = () => {
  const navigate = useNavigate();
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      setLoading(true);
      const data = await getAsistencias(currentPage, 10, debouncedSearchTerm);
      const asistenciasFiltradas = data.asistencias.filter(a => !a.presente);
      setAsistencias(asistenciasFiltradas);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchAsistencias();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="asistencias-container">
        <PageTitle title="Faltas" />

        <div className="asistencias-header">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={["", "Fecha", "Justificada", "Descripción", "Usuario"]}
              data={asistencias.map((a) => ({
                key: a._id,
                row: [
                  <button
                    key={`view-${a._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/asistencias/${a._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
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
                  <span key={`usuario-${a._id}`}>{a.usuario ? a.usuario.nombre : "Desconocido"}</span>,
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
      </div>
    </>
  );
};

export default Asistencias;
