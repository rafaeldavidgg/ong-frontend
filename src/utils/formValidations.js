export const validateField = (name, value, isEditing = false) => {
  switch (name) {
    case "nombre":
    case "apellido":
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
        return "No puede contener números ni caracteres especiales";
      }
      break;
    case "telefono":
      if (!isEditing && !value) return "Este campo es obligatorio";
      if (value && !/^\d{9}$/.test(value)) {
        return "Debe contener exactamente 9 dígitos";
      }
      break;
    case "dni":
      if (value && !/^\d{8}[A-Z]$/.test(value)) {
        return "Debe ser 8 números seguidos de 1 letra mayúscula";
      }
      break;
    case "tipoDeRelacionConUsuario":
      if (!isEditing && !value) return "Este campo es obligatorio";
      break;
    case "email":
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Debe ser un correo válido";
      }
      break;
    case "contraseña":
      if (!isEditing && !value) return "Este campo es obligatorio";
      if (value && value.length < 6) {
        return "Debe tener al menos 6 caracteres";
      }
      break;
    default:
      return "";
  }
  return "";
};
