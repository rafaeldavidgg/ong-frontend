import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrabajadores } from "../services/trabajadorService";
import { formatDate } from "../utils/dateUtils";
import { getRoles } from "../utils/rolesUtils";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import AddButton from "../components/AddButton";
import SearchInput from "../components/SearchInput";
import "./css/Trabajadores.css";

const Trabajadores = () => {
  const navigate = useNavigate();
  const [trabajadores, setTrabajadores] = useState([]);
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
    const fetchTrabajadores = async () => {
      setLoading(true);
      const data = await getTrabajadores(currentPage, 10, debouncedSearchTerm);
      setTrabajadores(data.trabajadores);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchTrabajadores();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="trabajadores-container">
        <PageTitle title="Trabajadores" />

        <div className="trabajadores-header">
          <AddButton to="/crear-trabajador" />
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
                "Teléfono",
                "Incorporación",
                "Tipo",
              ]}
              data={trabajadores.map((t) => ({
                key: t._id,
                row: [
                  <button
                    key={`view-${t._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/trabajadores/${t._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${t._id}`}>{t.nombre}</span>,
                  <span key={`apellido-${t._id}`}>{t.apellido}</span>,
                  <span key={`telefono-${t._id}`}>{t.telefono}</span>,
                  <span key={`fechaIncorporacion-${t._id}`}>
                    {formatDate(t.fechaIncorporacion)}
                  </span>,
                  <span key={`tipo-${t._id}`}>{getRoles(t.tipo)}</span>,
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

export default Trabajadores;
