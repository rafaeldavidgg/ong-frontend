export const TipoAutismoEnum = {
  AUTISMO_CLASICO: "Autismo clásico",
  ASPERGER: "Asperger",
  TGD_NE: "TGD no especificado",
  TRASTORNO_DESINTEGRATIVO: "Trastorno desintegrativo",
  AUTISMO_ALTO_FUNCIONAMIENTO: "Autismo alto funcionamiento",
};

export const getTipoAutismoLabel = (key) => {
  return TipoAutismoEnum[key] || "Desconocido";
};
