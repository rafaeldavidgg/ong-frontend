import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsuarios } from "../services/userService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import FilterButton from "../components/FilterButton";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput"
import { getTipoAutismoLabel } from "../utils/tipoAutismoUtils";
import "./css/Usuarios.css";

const Usuarios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroGrupoTrabajo, setFiltroGrupoTrabajo] = useState(null);
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
    const fetchUsuarios = async () => {
      setLoading(true);
      const data = await getUsuarios(
        currentPage,
        10,
        filtroGrupoTrabajo,
        debouncedSearchTerm
      );
      setUsuarios(data.usuarios);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchUsuarios();
  }, [currentPage, filtroGrupoTrabajo, debouncedSearchTerm]);

  const handleFilterChange = (grupo) => {
    setFiltroGrupoTrabajo(grupo);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFiltroGrupoTrabajo(null);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="usuarios-container">
        <PageTitle title="Usuarios" />

        <div className="usuarios-header">
          {user.rol === "Tecnico" && <AddButton to="/crear-usuario" />}{" "}
          <FilterButton
            onFilter={handleFilterChange}
            activeFilter={filtroGrupoTrabajo}
            onClearFilter={clearFilter}
          />
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
                "Apellidos",
                "Grado autismo",
                "Tipo autismo",
                "Asistencia",
              ]}
              data={usuarios.map((u) => ({
                key: u._id,
                row: [
                  <button
                    key={`view-${u._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/usuarios/${u._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${u._id}`}>{u.nombre}</span>,
                  <span key={`apellido-${u._id}`}>{u.apellido}</span>,
                  <span key={`grado-${u._id}`}>{u.gradoAutismo + "%"}</span>,
                  <span key={`tipo-${u._id}`}>
                    {getTipoAutismoLabel(u.tipoAutismo)}
                  </span>,
                  <button
                    key={`asistencia-${u._id}`}
                    className="asistencia-btn"
                  >
                    ✖
                  </button>,
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

export default Usuarios;
