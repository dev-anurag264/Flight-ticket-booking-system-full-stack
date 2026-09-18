import axiosClient from "./axiosClient";

export const bookingApi = {
  create: (data) => axiosClient.post("/bookings", data),
  getMyBookings: () => axiosClient.get("/bookings/my"),
  getByPnr: (pnr) => axiosClient.get(`/bookings/${pnr}`),
  cancel: (id) => axiosClient.patch(`/bookings/${id}/cancel`),
};
