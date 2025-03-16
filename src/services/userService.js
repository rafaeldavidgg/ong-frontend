import API_BASE_URL from "../config";

export const getUsuarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    return [];
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    return null;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createUsuario:", error);
    throw error;
  }
};
