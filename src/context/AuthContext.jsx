import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await authService.validateToken(token);
        console.log("Token válido, usuario autenticado:", data);
        setUser({ email: data.usuario.email, rol: data.usuario.tipo });
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    checkToken();
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const contextValue = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
