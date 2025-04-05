import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEventos } from "../services/eventoService";
import { formatDate } from "../utils/dateUtils";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput";
import "./css/Usuarios.css";

const Eventos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
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
      const data = await getEventos(currentPage, 10, debouncedSearchTerm);
      setEventos(data.eventos);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="actividades-container">
        <PageTitle title="Eventos" />

        <div className="usuarios-header">
          {user.rol === "Tecnico" && <AddButton to="/crear-evento" />}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={[
                "",
                "Nombre",
                "Fecha",
                "Entradas totales",
                "Entradas disponibles",
              ]}
              data={eventos.map((e) => ({
                key: e._id,
                row: [
                  <button
                    key={`ver-${e._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/eventos/${e._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${e._id}`}>{e.nombre}</span>,
                  <span key={`fecha-${e._id}`}>{formatDate(e.fecha)}</span>,
                  <span key={`totales-${e._id}`}>{e.entradasTotales}</span>,
                  <span key={`disponibles-${e._id}`}>
                    {e.entradasDisponibles}
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

export default Eventos;
