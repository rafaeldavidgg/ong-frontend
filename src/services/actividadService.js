import API_BASE_URL from "../config";

export const getActividades = async (
  page = 1,
  limit = 10,
  searchTerm = "",
  tipos = []
) => {
  try {
    let url = `${API_BASE_URL}/actividades?page=${page}&limit=${limit}`;

    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (tipos.length > 0) {
      url += tipos.map((t) => `&tipos=${encodeURIComponent(t)}`).join("");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las actividades");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getActividades:", error);
    return { actividades: [], totalPages: 1, currentPage: 1 };
  }
};

export const getActividadById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getActividadById:", error);
    return null;
  }
};

export const createActividad = async (actividadData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/actividades`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      throw new Error("Error al crear la actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createActividad:", error);
    throw error;
  }
};

export const updateActividad = async (id, actividadData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateActividad:", error);
    throw error;
  }
};

export const deleteActividad = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la actividad");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteActividad:", error);
    throw error;
  }
};
