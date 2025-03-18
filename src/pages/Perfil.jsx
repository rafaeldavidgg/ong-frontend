import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import PageTitle from "../components/PageTitle";
import ButtonSecondary from "../components/ButtonSecondary";
import { formatDate } from "../utils/dateUtils";
import "./css/UsuarioDetalle.css";

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const {
    nombre,
    apellido,
    telefono,
    dni,
    rol,
    email,
    fechaIncorporacion,
    tipoDeRelacionConUsuario,
  } = user;

  return (
    <>
      <Navbar />
      <div className="usuario-detalle-container">
        <PageTitle title="Mi perfil" />

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={nombre} />
          <DetailField label="Apellidos" value={apellido} />
          <DetailField label="Teléfono" value={telefono} />
          <DetailField label="DNI" value={dni} />
          <DetailField label="Email" value={email} />

          {rol === "Familiar" && (
            <DetailField label="Relación" value={tipoDeRelacionConUsuario} />
          )}

          {["Auxiliar", "Tecnico"].includes(rol) && (
            <DetailField
              label="Fecha incorporación"
              value={formatDate(fechaIncorporacion)}
            />
          )}
        </div>

        <div className="volver-container">
          <ButtonSecondary text="Volver" onClick={() => navigate(-1)} />
        </div>
      </div>
    </>
  );
};

export default Perfil;
