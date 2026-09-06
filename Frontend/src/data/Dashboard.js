import { api } from "./api";

export const AdminDashboardApi = {
  getCardData: async () => {
    const response = await api.get("/admin-dashboard");
    return response.data;
  },
  getOther: async () => {},
};
