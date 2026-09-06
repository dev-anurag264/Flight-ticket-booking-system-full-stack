import axiosClient from "./axiosClient";

export const flightApi = {
  getAll: () => axiosClient.get("/flights"),
  search: (params) => axiosClient.get("/flights/search", { params }),
  create: (data) => axiosClient.post("/flights/new", data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/flights/${id}/status`, { status }),
  delete: (id) => axiosClient.delete(`/flights/${id}`),
};
