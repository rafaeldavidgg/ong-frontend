export const validateField = (name, value) => {
  switch (name) {
    case "nombre":
    case "apellido":
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        return "No puede contener números ni caracteres especiales";
      }
      break;
    case "telefono":
      if (!/^\d{9}$/.test(value)) {
        return "Debe contener exactamente 9 dígitos";
      }
      break;
    case "dni":
      if (!/^\d{8}[A-Z]$/.test(value)) {
        return "Debe ser 8 números seguidos de 1 letra mayúscula";
      }
      break;
    case "gradoAutismo":
      if (isNaN(value) || value < 1 || value > 100) {
        return "Debe ser un número entre 1 y 100";
      }
      break;
    case "grupoTrabajo":
      if (isNaN(value) || value < 1) {
        return "Debe ser un número positivo";
      }
      break;
    default:
      return "";
  }
  return "";
};
