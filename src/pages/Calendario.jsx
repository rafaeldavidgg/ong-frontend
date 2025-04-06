import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { getActividadesPorUsuario } from "../services/actividadService";
import { getEventosPorMes } from "../services/eventoService";
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
    const fetchDatos = async () => {
      const { actividades } = await getActividadesPorUsuario(usuarioId);
      const eventosActividades = actividades.map((act) => ({
        id: act._id,
        title: act.nombre,
        start: new Date(act.fecha),
        end: new Date(act.fecha),
        allDay: true,
        tipo: "actividad",
      }));

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const eventosDB = await getEventosPorMes(year, month);
      const eventosEventos = eventosDB.map((ev) => ({
        id: ev._id,
        title: `${ev.nombre}`,
        start: new Date(ev.fecha),
        end: new Date(ev.fecha),
        allDay: true,
        tipo: "evento",
      }));

      setEventos([...eventosActividades, ...eventosEventos]);
      setLoading(false);
    };

    fetchDatos();
  }, [usuarioId, currentDate]);

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
    noEventsInRange: "No hay actividades o eventos en este rango",
  };

  return (
    <div className="calendario-container">
      <Navbar />
      <div className="calendario-content">
        <PageTitle title="Calendario" />
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
            eventPropGetter={(event) => {
              const baseStyle = {
                borderRadius: "8px",
                color: "white",
              };

              if (event.tipo === "actividad") {
                return {
                  style: {
                    ...baseStyle,
                    backgroundColor: "#104572",
                  },
                };
              } else if (event.tipo === "evento") {
                return {
                  style: {
                    ...baseStyle,
                    backgroundColor: "#E1B200",
                  },
                };
              }

              return {};
            }}
            onSelectEvent={(evento) => {
              if (evento.tipo === "actividad") {
                navigate(`/actividades/${evento.id}`);
              } else if (evento.tipo === "evento") {
                navigate(`/eventos/${evento.id}`);
              }
            }}
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
