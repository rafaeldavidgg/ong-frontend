import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import { getUsuariosAsociados } from "../services/userService";
import "./css/MisFamiliares.css";

const MisFamiliares = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!user?.usuariosAsociados?.length) return;
      const data = await getUsuariosAsociados(user.usuariosAsociados);
      setUsuarios(data);
    };

    fetchUsuarios();
  }, [user]);

  return (
    <div className="misfamiliares-container">
      <Navbar />
      <div className="misfamiliares-content">
        <PageTitle title="Mis familiares" />

        {usuarios.length === 0 ? (
          <div className="misfamiliares-empty">
            <p>Parece que no tienes usuarios asociados.</p>
            <p>
              Inicie una solicitud y espere que sea aceptada por un trabajador.
            </p>
            <p>Si tiene algún problema, contacte con la organización</p>
          </div>
        ) : (
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
                    onClick={() => navigate("/calendario")}
                  />
                  <ButtonSecondary
                    text="Actividades"
                    onClick={() => navigate("/actividades")}
                  />
                  <ButtonSecondary
                    text="Datos personales"
                    onClick={() => navigate("/datos-personales")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

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
