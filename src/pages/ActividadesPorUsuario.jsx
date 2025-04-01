import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getActividadesPorUsuario } from "../services/actividadService";
import { getUsuarioById } from "../services/userService";
import { formatDate } from "../utils/dateUtils";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import FilterTipoButton from "../components/FilterTipoButton";
import "./css/Usuarios.css";

const ActividadesPorUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroTipos, setFiltroTipos] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getActividadesPorUsuario(
        id,
        currentPage,
        10,
        debouncedSearchTerm,
        filtroTipos
      );
      setActividades(data.actividades);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };
    fetchData();

    const fetchUsuario = async () => {
      const data = await getUsuarioById(id);
      setUsuario(data);
    };
    fetchUsuario();
  }, [id, currentPage, debouncedSearchTerm, filtroTipos]);

  const handleFilterTipoChange = (tipos) => {
    setFiltroTipos(tipos);
    setCurrentPage(1);
  };

  const clearFilterTipo = () => {
    setFiltroTipos([]);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="actividades-container">
        <PageTitle
          title={`Actividades de ${
            usuario ? usuario.nombre + " " + usuario.apellido : "..."
          }`}
        />

        <div className="usuarios-header">
          <FilterTipoButton
            onFilter={handleFilterTipoChange}
            activeFilter={filtroTipos}
            onClearFilter={clearFilterTipo}
          />
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={["", "Nombre", "Fecha", "Tipo"]}
              data={actividades.map((a) => ({
                key: a._id,
                row: [
                  <button
                    key={`ver-${a._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/actividades/${a._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${a._id}`}>{a.nombre}</span>,
                  <span key={`fecha-${a._id}`}>{formatDate(a.fecha)}</span>,
                  <span key={`tipo-${a._id}`}>
                    {a.tipoActividad?.nombreTipo || "—"}
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

export default ActividadesPorUsuario;
