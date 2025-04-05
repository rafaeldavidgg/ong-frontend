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
import {
  getEventoById,
  participarEnEvento,
  solicitarEntradas,
} from "../services/eventoService";
import "./css/UsuarioDetalle.css";

const EventoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entradaCantidad, setEntradaCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [mensajeEntradas, setMensajeEntradas] = useState("");

  useEffect(() => {
    const fetchEvento = async () => {
      const data = await getEventoById(id);
      setEvento(data);
      setLoading(false);
    };
    fetchEvento();
  }, [id]);

  const handleParticipar = async () => {
    try {
      await participarEnEvento(evento._id, user._id);
      const updated = await getEventoById(evento._id);
      setEvento(updated);
      setMensaje("¡Te has apuntado como participante!");
    } catch (error) {
      console.error(error);
      setMensaje("Error al participar en el evento");
    }
  };

  const handleSolicitarEntradas = async () => {
    const cantidad = parseInt(entradaCantidad);

    if (isNaN(cantidad) || cantidad <= 0) {
      setMensajeEntradas("Debes solicitar al menos una entrada.");
      return;
    }

    try {
      await solicitarEntradas(evento._id, user._id, cantidad);
      const updated = await getEventoById(evento._id);
      setEvento(updated);
      setMensajeEntradas("");
    } catch (error) {
      console.error(error);
      setMensajeEntradas("Error al solicitar entradas");
    }
  };

  if (loading) return <></>;
  if (!evento) return <NotFound />;

  const yaParticipa = evento.participantes?.some((p) => p._id === user._id);
  const totalSolicitadas =
    evento.entradasSolicitadas?.find(
      (e) => e.usuario && e.usuario._id === user._id
    )?.cantidad || 0;

  return (
    <>
      <Navbar />
      <div className="usuario-detalle-container">
        <PageTitle title={`Detalle de ${evento.nombre}`} />

        {evento.entradasDisponibles > 0 && (
          <div className="generar-pdf-container">
            <label htmlFor="entradas" className="generar-pdf-label">
              Solicitar entradas:
            </label>
            <input
              id="entradas"
              type="number"
              min="1"
              max={evento.entradasDisponibles}
              value={entradaCantidad}
              onChange={(e) => setEntradaCantidad(e.target.value)}
              className="generar-pdf-input"
            />
            <div className="generar-pdf-button">
              <Button text="Solicitar" onClick={handleSolicitarEntradas} />
            </div>
            <div style={{ flexBasis: "100%", textAlign: "right" }}>
              <p className="info-text">
                Entradas solicitadas: {totalSolicitadas}
              </p>
            </div>
            {mensajeEntradas && (
              <div style={{ flexBasis: "100%", textAlign: "right" }}>
                <p className="error-text">{mensajeEntradas}</p>
              </div>
            )}
          </div>
        )}

        <div className="usuario-detalle-grid">
          <DetailField label="Nombre" value={evento.nombre} />
          <DetailField label="Fecha" value={formatDate(evento.fecha)} />
          <DetailField
            label="Descripción"
            value={evento.descripcion}
            isLongText
          />
          <DetailField
            label="Entradas totales"
            value={evento.entradasTotales}
          />
          <DetailField
            label="Entradas disponibles"
            value={evento.entradasDisponibles}
          />
          <DetailField
            label="Trabajadores mínimos"
            value={evento.trabajadoresMinimos}
          />
          <DetailField
            label="Creador"
            value={`${evento.creadoPor?.nombre || ""} ${
              evento.creadoPor?.apellido || ""
            }`}
          />
          <DetailField
            label="Trabajadores participantes"
            value={
              evento.participantes?.length > 0
                ? evento.participantes
                    .map((t) => `- ${t.nombre} ${t.apellido}`)
                    .join("\n")
                : "—"
            }
            isLongText
          />
        </div>

        {(user.rol === "Tecnico" || user.rol === "Auxiliar") &&
          !yaParticipa && (
            <div className="btn-participar-container">
              <Button text="Voy a participar" onClick={handleParticipar} />
            </div>
          )}

        {mensaje && <p className="success-text">{mensaje}</p>}

        <div className="volver-container">
          <ButtonSecondary text="Volver" onClick={() => navigate(-1)} />
          {user.rol === "Tecnico" && (
            <Button
              text="Editar"
              onClick={() => navigate(`/editar-evento/${evento._id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EventoDetalle;
