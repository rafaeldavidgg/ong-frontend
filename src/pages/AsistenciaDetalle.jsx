import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import { getAsistenciaById } from "../services/asistenciaService";
import NotFound from "../pages/NotFound";
import PageTitle from "../components/PageTitle";
import ButtonSecondary from "../components/ButtonSecondary";
import { formatDate } from "../utils/dateUtils";
import "./css/AsistenciaDetalle.css";

const AsistenciaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asistencia, setAsistencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsistencia = async () => {
      setLoading(true);
      const data = await getAsistenciaById(id);
      setAsistencia(data);
      setLoading(false);
    };

    fetchAsistencia();
  }, [id]);

  if (loading) return <></>;
  if (!asistencia) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="asistencia-detalle-container">
        <PageTitle title={`Detalle de la Asistencia`} />

        <div className="asistencia-detalle-grid">
          <DetailField label="Fecha" value={formatDate(asistencia.fecha)} />
          <DetailField
            label="Presente"
            value={asistencia.presente ? "Sí" : "No"}
          />
          <DetailField
            label="Justificada"
            value={asistencia.justificada ? "Sí" : "No"}
          />
          <DetailField
            label="Justificada por"
            value={
              asistencia.justificadaPor
                ? `${asistencia.justificadaPor.nombre} ${asistencia.justificadaPor.apellido}`
                : "-"
            }
          />
          <DetailField
            label="Descripción"
            value={asistencia.descripcion || "-"}
          />
          <DetailField
            label="Usuario"
            value={`${asistencia.usuario.nombre} ${asistencia.usuario.apellido}`}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() => navigate("/asistencias")}
          />
        </div>
      </div>
    </>
  );
};

export default AsistenciaDetalle;
