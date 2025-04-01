import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import DetailField from "../components/DetailField";
import { getUsuarioById } from "../services/userService";
import NotFound from "../pages/NotFound";
import PageTitle from "../components/PageTitle";
import { formatDate } from "../utils/dateUtils";
import { getTipoAutismoLabel } from "../utils/tipoAutismoUtils";
import ButtonSecondary from "../components/ButtonSecondary";
import Button from "../components/Button";
import { generateInformeUsuarioPDF } from "../utils/pdfUtils";
import { getActividadesPorUsuarioYMes } from "../services/actividadService";
import "./css/UsuarioDetalle.css";

const UsuarioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleGeneratePDF = async () => {
    if (!selectedMonth)
      return alert("Selecciona un mes antes de generar el informe.");

    const [year, month] = selectedMonth.split("-");
    const actividades = await getActividadesPorUsuarioYMes(
      usuario._id,
      year,
      month
    );
    generateInformeUsuarioPDF(usuario, actividades, selectedMonth);
  };

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

        {user.rol === "Tecnico" && (
          <div className="generar-pdf-container">
            <label htmlFor="mes" className="generar-pdf-label">
              Seleccionar mes:
            </label>
            <input
              type="month"
              id="mes"
              className="generar-pdf-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <div className="generar-pdf-button">
              <Button text="Generar informe PDF" onClick={handleGeneratePDF} />
            </div>
          </div>
        )}

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={usuario.nombre} />
          <DetailField label="Apellidos" value={usuario.apellido} />
          <DetailField
            label="Fecha nacimiento"
            value={formatDate(usuario.fechaNacimiento)}
          />
          <DetailField label="DNI" value={usuario.dni} />
          <DetailField
            label="Tipo autismo"
            value={getTipoAutismoLabel(usuario.tipoAutismo)}
          />
          <DetailField label="Grado autismo" value={usuario.gradoAutismo} />
          <DetailField label="Grupo trabajo" value={usuario.grupoTrabajo} />
          <DetailField label="Teléfono" value={usuario.telefono} />
        </div>

        <div className="volver-container">
          <ButtonSecondary
            text="Volver"
            onClick={() =>
              navigate(
                user.rol === "Familiar" ? "/mis-familiares" : "/usuarios"
              )
            }
          />
          {user.rol === "Familiar" && (
            <Button
              text="Justificar faltas"
              onClick={() => navigate(`/asistencias-usuario/${usuario._id}`)}
            />
          )}
          {user.rol === "Tecnico" && (
            <Button
              text="Editar"
              onClick={() => navigate(`/editar-usuario/${usuario._id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UsuarioDetalle;
