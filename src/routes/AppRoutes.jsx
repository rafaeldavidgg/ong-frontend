import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import Home from "../pages/Home";
import MisFamiliares from "../pages/MisFamiliares";
import Usuarios from "../pages/Usuarios";
import UsuarioDetalle from "../pages/UsuarioDetalle";
import CrearUsuario from "../pages/CrearUsuario";
import Trabajadores from "../pages/Trabajadores";
import TrabajadorDetalle from "../pages/TrabajadorDetalle";
import CrearTrabajador from "../pages/CrearTrabajador";
import Familiares from "../pages/Familiares";
import FamiliarDetalle from "../pages/FamiliarDetalle";
import EditarFamiliar from "../pages/EditarFamiliar";
import EditarTrabajador from "../pages/EditarTrabajador";
import EditarUsuario from "../pages/EditarUsuario";
import Perfil from "../pages/Perfil";
import Asistencias from "../pages/Asistencias";
import AsistenciaDetalle from "../pages/AsistenciaDetalle";
import SolicitarAsociacion from "../pages/SolicitarAsociacion";
import Solicitudes from "../pages/Solicitudes";
import AsistenciasPorUsuario from "../pages/AsistenciasPorUsuario";
import TipoActividades from "../pages/TipoActividades";
import CrearTipoActividad from "../pages/CrearTipoActividad";
import TipoActividadDetalle from "../pages/TipoActividadDetalle";
import EditarTipoActividad from "../pages/EditarTipoActividad";
import Actividades from "../pages/Actividades";
import CrearActividad from "../pages/CrearActividad";
import ActividadDetalle from "../pages/ActividadDetalle";
import EditarActividad from "../pages/EditarActividad";
import ActividadesPorUsuario from "../pages/ActividadesPorUsuario";
import Calendario from "../pages/Calendario";
import Incidencias from "../pages/Incidencias";
import CrearIncidencia from "../pages/CrearIncidencia";
import IncidenciaDetalle from "../pages/IncidenciaDetalle";
import EditarIncidencia from "../pages/EditarIncidencia";
import Eventos from "../pages/Eventos";
import CrearEvento from "../pages/CrearEvento";
import EventoDetalle from "../pages/EventoDetalle";
import EditarEvento from "../pages/EditarEvento";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/*" element={<NotFound />} />

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/usuarios/:id" element={<UsuarioDetalle />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/actividades/:id" element={<ActividadDetalle />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<EventoDetalle />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Tecnico", "Auxiliar"]} />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/tipo-actividades" element={<TipoActividades />} />
        <Route
          path="/tipo-actividades/:id"
          element={<TipoActividadDetalle />}
        />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/incidencias" element={<Incidencias />} />
        <Route path="/incidencias/:id" element={<IncidenciaDetalle />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Tecnico"]} />}>
        <Route path="/crear-usuario" element={<CrearUsuario />} />
        <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
        <Route path="/trabajadores/:id" element={<TrabajadorDetalle />} />
        <Route path="/crear-trabajador" element={<CrearTrabajador />} />
        <Route path="/editar-trabajador/:id" element={<EditarTrabajador />} />
        <Route path="/familiares" element={<Familiares />} />
        <Route path="/familiares/:id" element={<FamiliarDetalle />} />
        <Route path="/editar-familiar/:id" element={<EditarFamiliar />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/crear-tipo-actividad" element={<CrearTipoActividad />} />
        <Route
          path="/editar-tipo-actividad/:id"
          element={<EditarTipoActividad />}
        />
        <Route path="/crear-actividad" element={<CrearActividad />} />
        <Route path="/editar-actividad/:id" element={<EditarActividad />} />
        <Route path="/crear-evento" element={<CrearEvento />} />
        <Route path="/editar-evento/:id" element={<EditarEvento />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Auxiliar"]} />}>
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/asistencias/:id" element={<AsistenciaDetalle />} />
        <Route path="/crear-incidencia" element={<CrearIncidencia />} />
        <Route path="/editar-incidencia/:id" element={<EditarIncidencia />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Familiar"]} />}>
        <Route path="/mis-familiares" element={<MisFamiliares />} />
        <Route path="/solicitar-asociacion" element={<SolicitarAsociacion />} />
        <Route
          path="/asistencias-usuario/:usuarioId"
          element={<AsistenciasPorUsuario />}
        />
        <Route
          path="/actividades-usuario/:id"
          element={<ActividadesPorUsuario />}
        />
        <Route path="/calendario/:usuarioId" element={<Calendario />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
