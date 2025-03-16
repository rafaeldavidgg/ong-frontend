import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    if (user.rol === "Familiar" && location.pathname !== "/mis-familiares") {
      navigate("/mis-familiares", { replace: true });
    } else if (user.rol !== "Familiar" && location.pathname !== "/usuarios") {
      navigate("/usuarios", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
