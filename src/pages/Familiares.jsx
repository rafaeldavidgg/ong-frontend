import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFamiliares } from "../services/familiarService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import "./css/Familiares.css";

const Familiares = () => {
  const navigate = useNavigate();
  const [familiares, setFamiliares] = useState([]);
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
    const fetchFamiliares = async () => {
      setLoading(true);
      const data = await getFamiliares(currentPage, 10, debouncedSearchTerm);
      setFamiliares(data.familiares);
      setTotalPages(data.totalPages > 0 ? data.totalPages : 1);
      setLoading(false);
    };

    fetchFamiliares();
  }, [currentPage, debouncedSearchTerm]);

  return (
    <>
      <Navbar />
      <div className="familiares-container">
        <PageTitle title="Familiares" />

        <div className="familiares-header">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {loading ? (
          <></>
        ) : (
          <>
            <DataTable
              columns={["", "Nombre", "Apellidos", "Teléfono", "DNI", "Email"]}
              data={familiares.map((f) => ({
                key: f._id,
                row: [
                  <button
                    key={`view-${f._id}`}
                    className="view-btn"
                    onClick={() => navigate(`/familiares/${f._id}`)}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>,
                  <span key={`nombre-${f._id}`}>{f.nombre}</span>,
                  <span key={`apellido-${f._id}`}>{f.apellido}</span>,
                  <span key={`telefono-${f._id}`}>{f.telefono}</span>,
                  <span key={`dni-${f._id}`}>{f.dni}</span>,
                  <span key={`email-${f._id}`}>{f.email}</span>,
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

export default Familiares;
