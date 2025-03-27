import API_BASE_URL from "../config";

export const getFamiliares = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    let url = `${API_BASE_URL}/familiares?page=${page}&limit=${limit}`;
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
      throw new Error("Error al obtener los familiares");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getFamiliares:", error);
    return { familiares: [], totalPages: 1, currentPage: 1 };
  }
};

export const getFamiliarById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/familiares/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el familiar");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getFamiliarById:", error);
    return null;
  }
};

export const createFamiliar = async (familiarData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/familiares`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(familiarData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el familiar");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createFamiliar:", error);
    throw error;
  }
};

export const updateFamiliar = async (id, familiarData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/familiares/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(familiarData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar el familiar");
    }

    return data;
  } catch (error) {
    console.error("Error en updateFamiliar:", error);
    throw error;
  }
};

export const deleteFamiliar = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/familiares/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el familiar");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteFamiliar:", error);
    throw error;
  }
};
