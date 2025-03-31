import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getIncidencias } from "../services/incidenciaService";
import { formatDate } from "../utils/dateUtils";
import { getTipoIncidenciaLabel } from "../utils/tipoIncidenciaUtils";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput";
import "./css/Usuarios.css";

const Incidencias = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getIncidencias(currentPage, 10, debouncedSearchTerm);
      console.log("Incidencias recibidas:", data);
      setIncidencias(data.incidencias);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="actividades-container">
        <PageTitle title="Incidencias" />

        <div className="usuarios-header">
          {user.rol === "Auxiliar" && <AddButton to="/crear-incidencia" />}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={["", "Fecha", "Tipo", "Usuario", "Creador"]}
              data={incidencias.map((i) => ({
                key: i._id,
                row: [
                  <button
                    key={`ver-${i._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/incidencias/${i._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`fecha-${i._id}`}>{formatDate(i.fecha)}</span>,
                  <span key={`tipo-${i._id}`}>
                    {getTipoIncidenciaLabel(i.tipoIncidencia)}
                  </span>,
                  <span key={`usuario-${i._id}`}>
                    {i.usuario?.nombre} {i.usuario?.apellido}
                  </span>,
                  <span key={`creador-${i._id}`}>
                    {i.creadaPor?.nombre} {i.creadaPor?.apellido}
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
      </div>
    </>
  );
};

export default Incidencias;
