import { api } from "./api";

// Replace with real API data once available.
export const studentData = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/student/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/student/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newStudent) => {
    try {
      const response = await api.post("/student/store", newStudent, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, Student) => {
    try {
      const response = await api.put(`/student/update/${id}`, Student, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/student/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const AttendanceStudentApi = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/attendance/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/attendance/show${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (AddAttendance) => {
    try {
      const response = await api.post("/attendance/store", AddAttendance, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
const students = [
  // {
  //   id: 1,
  //   name: "Sophea Kim",
  //   rollNo: "S-1001",
  //   class: "Grade 9 - A",
  //   gender: "female",
  //   email: "sophea.kim@edumanage.io",
  //   status: "active",
  // },
  // {
  //   id: 2,
  //   name: "Dara Sok",
  //   rollNo: "S-1002",
  //   class: "Grade 9 - A",
  //   gender: "male",
  //   email: "dara.sok@edumanage.io",
  //   status: "active",
  // },
  // {
  //   id: 3,
  //   name: "Lina Chan",
  //   rollNo: "S-1003",
  //   class: "Grade 9 - B",
  //   gender: "female",
  //   email: "lina.chan@edumanage.io",
  //   status: "inactive",
  // },
  // {
  //   id: 4,
  //   name: "Vichet Ros",
  //   rollNo: "S-1004",
  //   class: "Grade 10 - A",
  //   gender: "male",
  //   email: "vichet.ros@edumanage.io",
  //   status: "active",
  // },
  // {
  //   id: 5,
  //   name: "Chenda Ly",
  //   rollNo: "S-1005",
  //   class: "Grade 10 - A",
  //   gender: "female",
  //   email: "chenda.ly@edumanage.io",
  //   status: "active",
  // },
  // {
  //   id: 6,
  //   name: "Piseth Heng",
  //   rollNo: "S-1006",
  //   class: "Grade 10 - B",
  //   gender: "male",
  //   email: "piseth.heng@edumanage.io",
  //   status: "active",
  // },
  // {
  //   id: 7,
  //   name: "Sreymom Ouk",
  //   rollNo: "S-1007",
  //   class: "Grade 11 - A",
  //   gender: "female",
  //   email: "sreymom.ouk@edumanage.io",
  //   status: "inactive",
  // },
  // {
  //   id: 8,
  //   name: "Ratanak Pich",
  //   rollNo: "S-1008",
  //   class: "Grade 11 - A",
  //   gender: "male",
  //   email: "ratanak.pich@edumanage.io",
  //   status: "active",
  // },
];

export default students;
