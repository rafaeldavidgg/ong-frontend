import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DetailField from "../components/DetailField";
import ButtonSecondary from "../components/ButtonSecondary";
import Button from "../components/Button";
import NotFound from "../pages/NotFound";
import { getTipoActividadById } from "../services/tipoActividadService";
import "./css/UsuarioDetalle.css";

const TipoActividadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActividad = async () => {
      setLoading(true);
      const data = await getTipoActividadById(id);
      setActividad(data);
      setLoading(false);
    };

    fetchActividad();
  }, [id]);

  if (loading) return <></>;
  if (!actividad) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="usuario-detalle-container">
        <PageTitle title={`Detalles de ${actividad.nombreTipo}`} />

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={actividad.nombreTipo} />
          <DetailField label="Duración (min)" value={actividad.duracion} />
          <DetailField
            label="Descripción"
            value={actividad.descripcion || "—"}
            isLongText={true}
          />
          <DetailField
            label="Materiales"
            value={actividad.materiales || "—"}
            isLongText={true}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() => navigate("/tipo-actividades")}
          />
          {user.rol === "Tecnico" && (
            <Button
              text="Editar"
              onClick={() =>
                navigate(`/editar-tipo-actividad/${actividad._id}`)
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TipoActividadDetalle;
