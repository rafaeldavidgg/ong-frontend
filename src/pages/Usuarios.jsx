import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsuarios } from "../services/userService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import FilterButton from "../components/FilterButton";
import AddButton from "../components/AddButton";
import { getTipoAutismoLabel } from "../utils/tipoAutismoUtils";
import "./css/Usuarios.css";

const Usuarios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroGrupoTrabajo, setFiltroGrupoTrabajo] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
      setLoading(false);
    };

    fetchUsuarios();
  }, []);

  const filteredUsuarios = filtroGrupoTrabajo
    ? usuarios.filter((u) => u.grupoTrabajo === filtroGrupoTrabajo)
    : usuarios;

  const handleFilterChange = (grupo) => {
    setFiltroGrupoTrabajo(grupo);
  };

  const clearFilter = () => {
    setFiltroGrupoTrabajo(null);
  };

  return (
    <>
      <Navbar />
      <div className="usuarios-container">
        <PageTitle title="Usuarios" />

        <div className="usuarios-header">
          {user.rol === "Tecnico" && <AddButton />}{" "}
          <FilterButton
            onFilter={handleFilterChange}
            activeFilter={filtroGrupoTrabajo}
            onClearFilter={clearFilter}
          />
        </div>

        {loading ? (
          <></>
        ) : (
          <DataTable
            columns={[
              "",
              "Nombre",
              "Apellidos",
              "Grado autismo",
              "Tipo autismo",
              "Asistencia",
            ]}
            data={filteredUsuarios.map((u) => ({
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
                <button key={`asistencia-${u._id}`} className="asistencia-btn">
                  ✖
                </button>,
              ],
            }))}
          />
        )}
      </div>
    </>
  );
};

export default Usuarios;
