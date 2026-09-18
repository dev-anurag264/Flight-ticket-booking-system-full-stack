import axiosClient from "./axiosClient";

export const paymentApi = {
  pay: (data) => axiosClient.post("/payments", data),
};
