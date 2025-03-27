import API_BASE_URL from "../config";

export const getTrabajadores = async (
  page = 1,
  limit = 10,
  searchTerm = ""
) => {
  try {
    let url = `${API_BASE_URL}/trabajadores?page=${page}&limit=${limit}`;
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
      throw new Error("Error al obtener los trabajadores");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getTrabajadores:", error);
    return { trabajadores: [], totalPages: 1, currentPage: 1 };
  }
};

export const getTrabajadorById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trabajadores/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el trabajador");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getTrabajadorById:", error);
    return null;
  }
};

export const createTrabajador = async (trabajadorData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/trabajadores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(trabajadorData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear el trabajador");
    }

    return data;
  } catch (error) {
    console.error("Error en createTrabajador:", error);
    throw error;
  }
};

export const updateTrabajador = async (id, trabajadorData) => {
  const response = await fetch(`${API_BASE_URL}/trabajadores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(trabajadorData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el trabajador");
  }

  return data;
};

export const deleteTrabajador = async (id) => {
  const response = await fetch(`${API_BASE_URL}/trabajadores/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el trabajador");
  }

  return await response.json();
};
