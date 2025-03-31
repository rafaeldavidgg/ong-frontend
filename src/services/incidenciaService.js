import API_BASE_URL from "../config";

export const getIncidencias = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    let url = `${API_BASE_URL}/incidencias?page=${page}&limit=${limit}`;

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
      throw new Error("Error al obtener las incidencias");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getIncidencias:", error);
    return {
      incidencias: [],
      totalIncidencias: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
};

export const getIncidenciaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la incidencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getIncidenciaById:", error);
    return null;
  }
};

export const createIncidencia = async (incidenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidencias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidenciaData),
    });

    if (!response.ok) {
      throw new Error("Error al crear la incidencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createIncidencia:", error);
    throw error;
  }
};

export const updateIncidencia = async (id, incidenciaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidenciaData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la incidencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateIncidencia:", error);
    throw error;
  }
};

export const deleteIncidencia = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incidencias/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la incidencia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteIncidencia:", error);
    throw error;
  }
};
