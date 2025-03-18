import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.validateToken(token);
        if (data.usuario) {
          setUser(data.usuario);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    console.log(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
