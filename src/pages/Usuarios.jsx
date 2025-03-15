import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsuarios } from "../services/userService";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DataTable from "../components/DataTable";
import FilterButton from "../components/FilterButton";
import AddButton from "../components/AddButton";
import "./css/Usuarios.css";

const Usuarios = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
      setLoading(false);
    };

    fetchUsuarios();
  }, []);

  return (
    <>
      <Navbar />
      <div className="usuarios-container">
        <PageTitle title="Usuarios" />

        <div className="usuarios-header">
          {user.rol === "Tecnico" && <AddButton />} <FilterButton />
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
            data={usuarios.map((u) => [
              <button
                key={`view-${u.id}`}
                className="view-btn"
                onClick={() => navigate(`/usuarios/${u.id}`)}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>,
              u.nombre,
              u.apellido,
              u.gradoAutismo + "%",
              u.tipoAutismo,
              <button key={`asistencia-${u.id}`} className="asistencia-btn">
                ✖
              </button>,
            ])}
          />
        )}
      </div>
    </>
  );
};

export default Usuarios;
