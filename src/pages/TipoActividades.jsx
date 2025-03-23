import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTipoActividades } from "../services/tipoActividadService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput";
import "./css/Familiares.css";

const TipoActividades = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTipoActividades = async () => {
      setLoading(true);
      const data = await getTipoActividades(
        currentPage,
        10,
        debouncedSearchTerm
      );
      setActividades(data.tipoActividades);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchTipoActividades();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="familiares-container">
        <PageTitle title="Tipos de Actividad" />

        <div className="familiares-header">
          {user.rol === "Tecnico" && <AddButton to="/crear-tipo-actividad" />}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={["", "Nombre", "Descripción", "Duración", "Materiales"]}
              data={actividades.map((a) => ({
                key: a._id,
                row: [
                  <button
                    key={`view-${a._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/tipo-actividades/${a._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${a._id}`}>{a.nombreTipo}</span>,
                  <span key={`descripcion-${a._id}`}>{a.descripcion}</span>,
                  <span key={`duracion-${a._id}`}>{a.duracion} min</span>,
                  <span key={`materiales-${a._id}`}>{a.materiales}</span>,
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

export default TipoActividades;
