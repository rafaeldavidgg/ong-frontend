import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import { getUsuarioById } from "../services/userService";
import NotFound from "../pages/NotFound";
import PageTitle from "../components/PageTitle";
import { formatDate } from "../utils/dateUtils";
import ButtonSecondary from "../components/ButtonSecondary";
import Button from "../components/Button";
import "./css/UsuarioDetalle.css";

const UsuarioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      const data = await getUsuarioById(id);
      setUsuario(data);
      setLoading(false);
    };

    fetchUsuario();
  }, [id]);

  if (loading) return <></>;
  if (!usuario) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="usuario-detalle-container">
        <PageTitle title={`Datos personales de ${usuario.nombre}`} />

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={usuario.nombre} />
          <DetailField label="Apellidos" value={usuario.apellido} />
          <DetailField
            label="Fecha nacimiento"
            value={formatDate(usuario.fechaNacimiento)}
          />
          <DetailField label="DNI" value={usuario.dni} />
          <DetailField label="Tipo autismo" value={usuario.tipoAutismo} />
          <DetailField label="Grado autismo" value={usuario.gradoAutismo} />
          <DetailField label="Grupo trabajo" value={usuario.grupoTrabajo} />
          <DetailField label="Teléfono" value={usuario.telefono} />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() =>
              navigate(user.rol === "Familiar" ? "/inicio" : "/usuarios")
            }
          />
          <Button
            text="Editar"
            onClick={() => navigate(`/editar-usuario/${usuario._id}`)}
          />
        </div>
      </div>
    </>
  );
};

export default UsuarioDetalle;
