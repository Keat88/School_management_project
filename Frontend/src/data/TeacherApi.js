import { api } from "./api";

export const teacherApi = {
  getAll: async (params) => {
    try {
      const response = await api.get("/teacher/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/teacher/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newTeacher) => {
    try {
      const response = await api.post("/teacher/store", newTeacher, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, teacher) => {
    try {
      const response = await api.put(`/teacher/update/${id}`, teacher, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/teacher/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
