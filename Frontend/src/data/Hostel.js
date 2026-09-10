import { api } from "./api";

export const hostelApi = {
  getAll: async (param) => {
    try {
      const response = await api.get("/hostels/hostel/index", {
        params: param,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching hostels:", error);
      throw error;
    }
  },
  addNew: async (param) => {
    try {
      const response = await api.post(
        "/hostels/hostel/store",
        param, // Pass param directly, not wrapped inside { param }
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating hostel:", error);
      throw error;
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/hostels/hostel/show/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching hostel details:", error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/hostels/hostel/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting hostel:", error);
      throw error;
    }
  },
  update: async (id, param) => {
    try {
      const response = await api.put(`/hostels/hostel/update/${id}`, param); // Pass param directly here too
      return response.data;
    } catch (error) {
      console.error("Error updating hostel:", error);
      throw error;
    }
  },
};
export const hostelRoomApi = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/hostels/hostel-room/index", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/hostels/hostel-room/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newRoom) => {
    try {
      const response = await api.post("/hostels/hostel-room/store", newRoom, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, UpdateRoom) => {
    try {
      const response = await api.put(
        `/hostels/hostel-room/update/${id}`,
        UpdateRoom,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/hostels/hostel-room/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const HotelCagegoryApi = {
  getAll: async () => {
    try {
      const response = await api.get("/hostels/hostel/index");
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/hostels/hostel/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async () => {
    try {
      const response = await api.post(`/hostels/hostel/store`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, NewHostel) => {
    try {
      const response = await api.put(
        `/hostels/hostel/update/${id}`,
        NewHostel,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.put(`/hostels/hostel/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const AddStudentHostelApi = {
  getAll: async (param) => {
    try {
      const response = await api.get("/hostels/hostel-assignment/index", {
        param,
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newHostel) => {
    try {
      const response = await api.post(
        "/hostels/hostel-assignment/store",
        newHostel,
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/hostels/hostel-assignment/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (upDateStudentAssign, id) => {
    try {
      const response = await api.put(
        `/classroom/update/${id}`,
        upDateStudentAssign,
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.post(
        `/hostels/hostel-assignment/destroy/${id}`,
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
