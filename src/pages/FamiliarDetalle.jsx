import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import { getFamiliarById } from "../services/familiarService";
import NotFound from "../pages/NotFound";
import PageTitle from "../components/PageTitle";
import ButtonSecondary from "../components/ButtonSecondary";
import Button from "../components/Button";
import "./css/FamiliarDetalle.css";

const FamiliarDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [familiar, setFamiliar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamiliar = async () => {
      setLoading(true);
      const data = await getFamiliarById(id);
      setFamiliar(data);
      setLoading(false);
    };

    fetchFamiliar();
  }, [id]);

  if (loading) return <></>;
  if (!familiar) return <NotFound />;

  return (
    <>
      <Navbar />
      <div className="familiar-detalle-container">
        <PageTitle title={`Datos personales de ${familiar.nombre}`} />

        <div className="familiar-detalle-grid">
          <DetailField label="Nombre" value={familiar.nombre} />
          <DetailField label="Apellidos" value={familiar.apellido} />
          <DetailField label="Teléfono" value={familiar.telefono} />
          <DetailField label="DNI" value={familiar.dni} />
          <DetailField label="Email" value={familiar.email} />
          <DetailField
            label="Relación"
            value={familiar.tipoDeRelacionConUsuario}
            isLongText={true}
          />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() => navigate("/familiares")}
          />
          <Button
            text="Editar"
            onClick={() => navigate(`/editar-familiar/${familiar._id}`)}
          />
        </div>
      </div>
    </>
  );
};

export default FamiliarDetalle;
