import moment from "moment";

export const formatDate = (isoString) => {
  if (!isoString) return "Fecha no disponible";
  return moment(isoString).format("DD/MM/YYYY");
};
