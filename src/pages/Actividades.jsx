import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getActividades } from "../services/actividadService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput";
import FilterTipoButton from "../components/FilterTipoButton";
import "./css/Usuarios.css";

const Actividades = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
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
      const data = await getActividades(
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
  }, [currentPage, debouncedSearchTerm, filtroTipos]);

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
        <PageTitle title="Actividades" />

        <div className="usuarios-header">
          {user.rol === "Tecnico" && <AddButton to="/crear-actividad" />}
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
              columns={["", "Nombre", "Fecha", "Tipo", "Creador"]}
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
                  <span key={`fecha-${a._id}`}>
                    {new Date(a.fecha).toLocaleDateString()}
                  </span>,
                  <span key={`tipo-${a._id}`}>
                    {a.tipoActividad?.nombreTipo || "—"}
                  </span>,
                  <span key={`creador-${a._id}`}>
                    {a.creadaPor?.nombre} {a.creadaPor?.apellido}
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

export default Actividades;
