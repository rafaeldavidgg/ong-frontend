import API_BASE_URL from "../config";

export const getEventos = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    let url = `${API_BASE_URL}/eventos?page=${page}&limit=${limit}`;
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

    if (!response.ok) throw new Error("Error al obtener eventos");

    return await response.json();
  } catch (error) {
    console.error("Error en getEventos:", error);
    return { eventos: [], totalPages: 1, currentPage: 1 };
  }
};

export const getEventoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al obtener el evento");

    return await response.json();
  } catch (error) {
    console.error("Error en getEventoById:", error);
    return null;
  }
};

export const createEvento = async (eventoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message + ": " + errorData.error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createEvento:", error);
    throw error;
  }
};

export const participarEnEvento = async (eventoId, trabajadorId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/eventos/${eventoId}/participar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trabajadorId }),
      }
    );

    if (!response.ok) throw new Error("Error al participar en el evento");

    return await response.json();
  } catch (error) {
    console.error("Error en participarEnEvento:", error);
    throw error;
  }
};

export const solicitarEntradas = async (eventoId, usuarioId, cantidad) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/eventos/${eventoId}/entradas`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId, cantidad }),
      }
    );

    if (!response.ok) throw new Error("Error al solicitar entradas");

    return await response.json();
  } catch (error) {
    console.error("Error en solicitarEntradas:", error);
    throw error;
  }
};

export const getEventosPorMes = async (year, month) => {
  try {
    const url = `${API_BASE_URL}/eventos/por-mes/listado?year=${year}&month=${month}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al obtener los eventos por mes");

    return await response.json();
  } catch (error) {
    console.error("Error en getEventosPorMes:", error);
    return [];
  }
};

export const updateEvento = async (id, eventoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar evento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateEvento:", error);
    throw error;
  }
};

export const deleteEvento = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error al eliminar evento");

    return await response.json();
  } catch (error) {
    console.error("Error en deleteEvento:", error);
    throw error;
  }
};
