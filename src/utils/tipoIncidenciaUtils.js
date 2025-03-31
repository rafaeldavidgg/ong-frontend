export const TipoIncidenciaEnum = {
  AGITACION: "Agitación",
  AGRESION_VERBAL: "Agresión verbal",
  AGRESION_FISICA: "Agresión física",
  AUTOLESION: "Autolesión",
  SOBRECARGA_SENSORIAL: "Sobrecarga sensorial",
  OTRO: "Otro",
};

export const getTipoIncidenciaLabel = (key) => {
  return TipoIncidenciaEnum[key] || "Desconocido";
};
