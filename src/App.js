import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;
