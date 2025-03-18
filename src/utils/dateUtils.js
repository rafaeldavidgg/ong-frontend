import moment from "moment";

export const formatDate = (isoString) => {
  if (!isoString) return "";
  return moment(isoString).format("DD/MM/YYYY");
};
