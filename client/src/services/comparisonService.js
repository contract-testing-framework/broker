import axios from "axios";

export const getAll = async () => {
  const { data } = await axios.get("/api/comparisons");
  return data;
};