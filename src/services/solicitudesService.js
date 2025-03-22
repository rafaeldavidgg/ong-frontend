import API_BASE_URL from "../config";

export const crearSolicitudAsociacion = async (familiarId, dniUsuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ familiarId, dniUsuario }),
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || "Error al crear la solicitud");
    }

    return data;
  } catch (error) {
    console.error("Error en crearSolicitudAsociacion:", error);
    throw error;
  }
};

export const getSolicitudes = async (page = 1, limit = 10, search = "") => {
  try {
    let url = `${API_BASE_URL}/solicitudes?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las solicitudes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getSolicitudes:", error);
    return { solicitudes: [], totalPages: 1, currentPage: 1 };
  }
};

export const aceptarSolicitud = async (id) => {
  const response = await fetch(`${API_BASE_URL}/solicitudes/${id}/aceptar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al aceptar la solicitud");
};

export const rechazarSolicitud = async (id) => {
  const response = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Error al rechazar la solicitud");
};
