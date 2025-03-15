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
