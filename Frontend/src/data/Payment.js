import { api } from "./api";



export const paymentApi = {
  getAll: async (params) => {
    const response = await api.get("/payments/index", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/payments/store", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/payments/update/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/payments/destroy/${id}`);
    return response.data;
  },
};
