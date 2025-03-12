import API_BASE_URL from "../config";

const login = async (email, contraseña) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contraseña }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al iniciar sesión");

  return data;
};

export default { login };
