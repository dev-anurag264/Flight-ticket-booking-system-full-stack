import axiosClient from "./axiosClient";

export const seatApi = {
  getSeats: (flightId) => axiosClient.get(`/flights/${flightId}/seats`),
  generate: (flightId, data) =>
    axiosClient.post(`/flights/${flightId}/seats/generate`, data),
  hold: (seatId) => axiosClient.post(`/seats/hold`, { seatId }),
};
