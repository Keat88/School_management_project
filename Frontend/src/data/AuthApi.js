import { api } from "./api";

export const AuthApi = {
  Login: async (Login) => {
    try {
      const response = await api.post("/login", Login);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  Register: async (Register) => {
    try {
      const response = await api.post("/register", Register);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  Logout: async () => {
    try {
      const response = await api.get("/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  forSendOtp: async (data) => {
    try {
      const response = await api.post("/forgot-password-senotp", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  forVerifyOtp: async (data) => {
    try {
      const response = await api.post("/forgot-password-verify", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ResetNewPassword: async (data) => {
    try {
      const response = await api.post("/reset-password-reset", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
