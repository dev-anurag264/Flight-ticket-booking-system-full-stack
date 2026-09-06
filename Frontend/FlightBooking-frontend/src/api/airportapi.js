import axiosClient from "./axiosClient";

export const airportApi = {
  getAll: () => axiosClient.get("/airports"),
  create: (data) => axiosClient.post("/airports/new-airport", data),
  update: (id, data) => axiosClient.put(`/airports/${id}`, data),
  delete: (id) => axiosClient.delete(`/airports/${id}`),
};
