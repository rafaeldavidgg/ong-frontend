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
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Tecnico", "Auxiliar"]} />}>
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Tecnico"]} />}>
        <Route path="/crear-usuario" element={<CrearUsuario />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
        <Route path="/trabajadores/:id" element={<TrabajadorDetalle />} />
        <Route path="/crear-trabajador" element={<CrearTrabajador />} />
        <Route path="/familiares" element={<Familiares />} />
        <Route path="/familiares/:id" element={<FamiliarDetalle />} />
        <Route path="/editar-familiar/:id" element={<EditarFamiliar />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["Familiar"]} />}>
        <Route path="/mis-familiares" element={<MisFamiliares />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
