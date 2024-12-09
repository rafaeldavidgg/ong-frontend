import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CrearUsuarios = () => {
  const valorInicial = {
    nombre: "",
    apellido: "",
    edad: 18,
    telefono: 0,
    correo: "",
  };

  let { id } = useParams();

  const [usuario, setUsuario] = useState(valorInicial);
  const [subId, setSubId] = useState(id);

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const guardarDatos = async (e) => {
    e.preventDefault();

    // Logica POST
    const newUser = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      edad: usuario.edad,
      telefono: usuario.telefono,
      correo: usuario.correo,
    };
    await axios.post("http://localhost:4000/api/usuarios", newUser);

    // Mostrar datos iniciales tras crear
    setUsuario({ ...valorInicial });
  };

  // Logica PUT
  const actualizarUsuario = async(e)=> {
    e.preventDefault();

    const editUser = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        edad: usuario.edad,
        telefono: usuario.telefono,
        coreo: usuario.correo
    }
    await axios.put("http://localhost:4000/api/usuarios/" + subId, editUser)
  }

  const obtenerUno = async (valorId) => {
    const res = await axios.get(
      "http://localhost:4000/api/usuarios/" + valorId
    );
    setUsuario({
      nombre: res.data.nombre,
      apellido: res.data.apellido,
      edad: res.data.edad,
      telefono: res.data.telefono,
      correo: res.data.correo,
    });
  };

  useEffect(() => {
    if (subId !== "") {
      obtenerUno(subId);
    }
  }, [subId]);

  return (
    <div className="col-md-6 offset-md-3">
      <div className="card card-body">
        <form onSubmit={guardarDatos}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              aria-label="Nombre"
              required
              name="nombre"
              value={usuario.nombre}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Apellido"
              aria-label="Apellido"
              required
              name="apellido"
              value={usuario.apellido}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Edad"
              aria-label="Edad"
              required
              name="edad"
              value={usuario.edad}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Telefono"
              aria-label="Telefono"
              required
              name="telefono"
              value={usuario.telefono}
              onChange={capturarDatos}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Correo"
              aria-label="Correo"
              required
              name="correo"
              value={usuario.correo}
              onChange={capturarDatos}
            />
          </div>

          <button type="submit" className="btn btn-primary form-control">
            Guardar
          </button>
        </form>
        <form onSubmit={actualizarUsuario}>
            <button className="btn btn-danger form-control mt-2">
                Actualizar
            </button>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuarios;
