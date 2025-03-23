import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DetailField from "../components/DetailField";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import NotFound from "./NotFound";
import { getActividadById } from "../services/actividadService";
import "./css/UsuarioDetalle.css";

const ActividadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActividad = async () => {
      const data = await getActividadById(id);
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
        <PageTitle title={`Detalle de ${actividad.nombre}`} />

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={actividad.nombre} />
          <DetailField
            label="Fecha"
            value={new Date(actividad.fecha).toLocaleDateString()}
          />
          <DetailField
            label="Tipo"
            value={actividad.tipoActividad?.nombreTipo || "—"}
          />
          <DetailField
            label="Creador"
            value={`${actividad.creadaPor?.nombre || ""} ${
              actividad.creadaPor?.apellido || ""
            }`}
          />
          <DetailField
            label="Usuarios participantes"
            value={
              actividad.realizadaPor?.length > 0
                ? actividad.realizadaPor
                    .map((u) => `- ${u.nombre} ${u.apellido}`)
                    .join("\n")
                : "—"
            }
            isLongText={true}
          />
          <DetailField
            label="Ejecutada por"
            value={
              actividad.ejecutadaPor?.length > 0
                ? actividad.ejecutadaPor
                    .map((t) => `- ${t.nombre} ${t.apellido}`)
                    .join("\n")
                : "—"
            }
            isLongText={true}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() => navigate("/actividades")}
          />
          {user.rol === "Tecnico" && (
            <Button
              text="Editar"
              onClick={() => navigate(`/editar-actividad/${actividad._id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ActividadDetalle;
