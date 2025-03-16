export const Roles = {
  Familiar: "Familiar",
  Tecnico: "Técnico",
  Auxiliar: "Auxiliar",
};

export const getRoles = (key) => {
  return Roles[key] || "Desconocido";
};
