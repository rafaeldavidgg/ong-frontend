import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import { getTrabajadorById } from "../services/trabajadorService";
import NotFound from "../pages/NotFound";
import PageTitle from "../components/PageTitle";
import { formatDate } from "../utils/dateUtils";
import { getRoles } from "../utils/rolesUtils";
import ButtonSecondary from "../components/ButtonSecondary";
import Button from "../components/Button";
import "./css/TrabajadorDetalle.css";

const TrabajadorDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trabajador, setTrabajador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrabajador = async () => {
      setLoading(true);
      const data = await getTrabajadorById(id);
      setTrabajador(data);
      setLoading(false);
    };

    fetchTrabajador();
  }, [id]);

  if (loading) return <></>;
  if (!trabajador) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="trabajador-detalle-container">
        <PageTitle title={`Datos personales de ${trabajador.nombre} (${getRoles(trabajador.tipo)})`} />

        <div className="trabajador-detalle-grid">
          <DetailField label="Nombre" value={trabajador.nombre} />
          <DetailField label="Apellidos" value={trabajador.apellido} />
          <DetailField label="Teléfono" value={trabajador.telefono} />
          <DetailField label="DNI" value={trabajador.dni} />
          <DetailField label="Email" value={trabajador.email} />
          <DetailField
            label="Fecha de Incorporación"
            value={formatDate(trabajador.fechaIncorporacion)}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() => navigate("/trabajadores")}
          />
          <Button
            text="Editar"
            onClick={() => navigate(`/editar-trabajador/${trabajador._id}`)}
          />
        </div>
      </div>
    </>
  );
};

export default TrabajadorDetalle;
