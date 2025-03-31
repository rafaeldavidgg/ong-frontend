import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import DetailField from "../components/DetailField";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import NotFound from "./NotFound";
import { formatDate } from "../utils/dateUtils";
import { getIncidenciaById } from "../services/incidenciaService";
import { getTipoIncidenciaLabel } from "../utils/tipoIncidenciaUtils";
import "./css/UsuarioDetalle.css";

const IncidenciaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incidencia, setIncidencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidencia = async () => {
      const data = await getIncidenciaById(id);
      setIncidencia(data);
      setLoading(false);
    };
    fetchIncidencia();
  }, [id]);

  if (loading) return <></>;
  if (!incidencia) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="usuario-detalle-container">
        <PageTitle title="Detalle de incidencia" />

        <div className="usuario-detalle-grid">
          <DetailField label="Fecha" value={formatDate(incidencia.fecha)} />
          <DetailField
            label="Tipo"
            value={getTipoIncidenciaLabel(incidencia.tipoIncidencia)}
          />
          <DetailField
            label="Usuario implicado"
            value={
              incidencia.usuario
                ? `${incidencia.usuario.nombre} ${incidencia.usuario.apellido}`
                : "—"
            }
          />
          {user.rol !== "Familiar" && (
            <DetailField
              label="Creador"
              value={
                incidencia.creadaPor
                  ? `${incidencia.creadaPor.nombre} ${incidencia.creadaPor.apellido}`
                  : "—"
              }
            />
          )}
          <DetailField
            label="Descripción"
            value={incidencia.descripcion || "—"}
            isLongText={true}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary text="Volver" onClick={() => navigate(-1)} />
          {user.rol === "Auxiliar" && (
            <Button
              text="Editar"
              onClick={() => navigate(`/editar-incidencia/${incidencia._id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default IncidenciaDetalle;
