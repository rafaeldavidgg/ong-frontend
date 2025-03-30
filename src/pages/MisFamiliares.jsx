import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import { getUsuariosAsociados } from "../services/userService";
import LoadingScreen from "../components/LoadingScreen";
import "./css/MisFamiliares.css";

const MisFamiliares = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!user?.usuariosAsociados?.length) {
        setLoading(false);
        return;
      }
      const data = await getUsuariosAsociados(user.usuariosAsociados);
      setUsuarios(data);
      setLoading(false);
    };

    fetchUsuarios();
  }, [user]);

  let contenido;

  if (loading) {
    contenido = <LoadingScreen />;
  } else if (usuarios.length === 0) {
    contenido = (
      <div className="misfamiliares-empty">
        <p>Parece que no tienes usuarios asociados.</p>
        <p>Inicie una solicitud y espere que sea aceptada por un trabajador.</p>
        <p>Si tiene algún problema, contacte con la organización</p>
      </div>
    );
  } else {
    contenido = (
      <div className="misfamiliares-grid">
        {usuarios.map((usuario) => (
          <div key={usuario._id} className="misfamiliares-card">
            <h2 className="misfamiliares-card-title">
              {usuario.nombre} {usuario.apellido}
            </h2>
            <div className="misfamiliares-card-spacer" />
            <div className="misfamiliares-card-buttons">
              <ButtonSecondary
                text="Calendario"
                onClick={() => navigate(`/calendario/${usuario._id}`)}
              />
              <ButtonSecondary
                text="Actividades"
                onClick={() => navigate(`/actividades-usuario/${usuario._id}`)}
              />
              <ButtonSecondary
                text="Datos personales"
                onClick={() => navigate(`/usuarios/${usuario._id}`)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="misfamiliares-container">
      <Navbar />
      <div className="misfamiliares-content">
        <PageTitle title="Mis familiares" />

        {contenido}

        <div className="misfamiliares-button-wrapper">
          <Button
            text="Solicitar asociación"
            onClick={() => navigate("/solicitar-asociacion")}
          />
        </div>
      </div>
    </div>
  );
};

export default MisFamiliares;
