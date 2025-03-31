import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { getActividadesPorUsuario } from "../services/actividadService";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./css/Calendario.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import LoadingScreen from "../components/LoadingScreen";

moment.locale("es");
const localizer = momentLocalizer(moment);

const Calendario = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchActividades = async () => {
      const { actividades } = await getActividadesPorUsuario(usuarioId);
      const eventosFormateados = actividades.map((act) => ({
        id: act._id,
        title: act.nombre,
        start: new Date(act.fecha),
        end: new Date(act.fecha),
        allDay: true,
      }));
      setEventos(eventosFormateados);
      setLoading(false);
    };

    fetchActividades();
  }, [usuarioId]);

  const mensajes = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay actividades en este rango",
  };

  return (
    <div className="calendario-container">
      <Navbar />
      <div className="calendario-content">
        <PageTitle title="Calendario de actividades" />
        {loading ? (
          <LoadingScreen />
        ) : (
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            messages={mensajes}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "#104572",
                color: "white",
                borderRadius: "8px",
              },
            })}
            onSelectEvent={(evento) => navigate(`/actividades/${evento.id}`)}
            views={["month", "week", "day", "agenda"]}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
          />
        )}
      </div>
    </div>
  );
};

export default Calendario;
