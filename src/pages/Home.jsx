import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.rol === "Familiar") {
        navigate("/mis-familiares");
      } else {
        navigate("/usuarios");
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
