import API_BASE_URL from "../config";

export const getUsuarios = async (
  page = 1,
  limit = 10,
  grupoTrabajo = null,
  searchTerm = ""
) => {
  try {
    let url = `${API_BASE_URL}/usuarios?page=${page}&limit=${limit}`;

    if (grupoTrabajo) {
      url += `&grupoTrabajo=${grupoTrabajo}`;
    }

    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await fetch(url, {
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
    return { usuarios: [], totalPages: 1, currentPage: 1 };
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

export const updateUsuario = async (id, usuarioData) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el usuario");
  }

  return await response.json();
};

export const deleteUsuario = async (id) => {
  const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el usuario");
  }

  return await response.json();
};
