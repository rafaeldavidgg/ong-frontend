import API_BASE_URL from "../config";

export const getAsistencias = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    let url = `${API_BASE_URL}/asistencias?page=${page}&limit=${limit}`;

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
      throw new Error("Error al obtener las asistencias");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAsistencias:", error);
    return { asistencias: [], totalPages: 1, currentPage: 1 };
  }
};

export const getAsistenciasByUsuario = async (usuarioId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/asistencias/usuario/${usuarioId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las asistencias del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAsistenciasByUsuario:", error);
    return [];
  }
};

export const getAsistenciaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la asistencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAsistenciaById:", error);
    return null;
  }
};

export const createAsistencia = async (asistenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(asistenciaData),
    });

    if (!response.ok) {
      throw new Error("Error al crear la asistencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createAsistencia:", error);
    throw error;
  }
};

export const updateAsistencia = async (id, asistenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/asistencias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(asistenciaData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la asistencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateAsistencia:", error);
    throw error;
  }
};
