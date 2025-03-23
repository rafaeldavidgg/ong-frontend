import API_BASE_URL from "../config";

export const getTipoActividades = async (
  page = 1,
  limit = 10,
  searchTerm = ""
) => {
  try {
    let url = `${API_BASE_URL}/tipo-actividades?page=${page}&limit=${limit}`;
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
      throw new Error("Error al obtener los tipos de actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getTipoActividades:", error);
    return { tipoActividades: [], totalPages: 1, currentPage: 1 };
  }
};

export const getTipoActividadById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tipo-actividades/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el tipo de actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getTipoActividadById:", error);
    return null;
  }
};

export const createTipoActividad = async (actividadData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/tipo-actividades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el tipo de actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createTipoActividad:", error);
    throw error;
  }
};

export const updateTipoActividad = async (id, actividadData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/tipo-actividades/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el tipo de actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateTipoActividad:", error);
    throw error;
  }
};

export const deleteTipoActividad = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/tipo-actividades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el tipo de actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteTipoActividad:", error);
    throw error;
  }
};
