import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./css/Navbar.css";
import logo from "../assets/logo.png";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  if (!user) return null;

  const getLinks = () => {
    switch (user.rol) {
      case "Familiar":
        return [{ path: "/mis-familiares", label: "Mis familiares" }];
      case "Auxiliar":
        return [
          { path: "/usuarios", label: "Usuarios" },
          { path: "/actividades", label: "Actividades" },
          { path: "/incidencias", label: "Incidencias" },
          { path: "/asistencias", label: "Faltas" },
        ];
      case "Tecnico":
        return [
          { path: "/usuarios", label: "Usuarios" },
          { path: "/actividades", label: "Actividades" },
          { path: "/incidencias", label: "Incidencias" },
          { path: "/trabajadores", label: "Trabajadores" },
          { path: "/familiares", label: "Familiares" },
          { path: "/solicitudes", label: "Solicitudes" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-logo-container">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className="menu-button"
            onClick={() => setLeftMenuOpen(!leftMenuOpen)}
          >
            <i className="bi bi-chevron-down"></i>
          </button>
          {leftMenuOpen && (
            <div className="menu-dropdown left">
              {getLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="menu-item"
                  onClick={() => setLeftMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-nav">
          {getLinks().map((link) => (
            <Link key={link.path} to={link.path} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className="menu-button"
            onClick={() => setRightMenuOpen(!rightMenuOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
          {rightMenuOpen && (
            <div className="menu-dropdown">
              <Link
                to="/perfil"
                className="menu-item"
                onClick={() => setRightMenuOpen(false)}
              >
                Mi perfil
              </Link>
              <button onClick={logout} className="menu-item logout">
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
