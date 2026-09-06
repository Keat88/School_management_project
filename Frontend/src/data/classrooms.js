import { api } from "./api";

// Replace with real API data once available.
export const classRoomApi = {
  getAll: async (params) => {
    try {
      const response = await api.get("/classroom/index", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  },

  addNew: async (newClass) => {
    try {
      const response = await api.post("/classroom/store", newClass, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding classroom:", error);
      throw error;
    }
  },

  // Renamed to getById to match ClassroomDetail.jsx call
  getById: async (id) => {
    try {
      const response = await api.get(`/classroom/show/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching classroom by ID:", error);
      throw error;
    }
  },

  // Alias for backward compatibility if used elsewhere
  getShow: async (id) => {
    return await classRoomApi.getById(id);
  },

  upDate: async (upDateClass, id) => {
    try {
      // If passing FormData with binary files, use POST + _method spoofing for Laravel
      if (upDateClass instanceof FormData) {
        upDateClass.append("_method", "PUT");
        const response = await api.post(
          `/classroom/update/${id}`,
          upDateClass,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      }

      // Standard JSON PUT update
      const response = await api.put(`/classroom/update/${id}`, upDateClass);
      return response.data;
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/classroom/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting classroom:", error);
      throw error;
    }
  },
};
export const Year = {
  getAll: async (paramt) => {
    try {
      const response = await api.get("/academic-years/index", { paramt });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/academic-years/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const subjectApi = {
  getAll: async (param) => {
    try {
      const response = await api.get("/subject/index", param);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newSubject) => {
    try {
      const response = await api.post("/subject/store", newSubject, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/subject/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (updateSubject, id) => {
    try {
      const response = await api.post(`/subject/update/${id}`, updateSubject, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/subject/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const SchedultTimeApi = {
  getAll: async (params) => {
    try {
      const response = await api.get("/timetable/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/timetable/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newSchedult) => {
    try {
      const response = await api.post("/timetable/store", newSchedult, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, Schedult) => {
    try {
      const response = await api.put(`/timetable/update/${id}`, Schedult, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/timetable/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
const classrooms = [
  {
    id: 1,
    name: "Grade 9",
    section: "A",
    academicYear: "2026 - 2027",
    teacher: "Sokha Chan",
    studentCount: 32,
    subjectCount: 8,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Physical Education",
    ],
  },
  {
    id: 2,
    name: "Grade 9",
    section: "B",
    academicYear: "2026 - 2027",
    teacher: "Reth Vong",
    studentCount: 30,
    subjectCount: 8,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Physical Education",
    ],
  },
  {
    id: 3,
    name: "Grade 10",
    section: "A",
    academicYear: "2026 - 2027",
    teacher: "Malis Ouk",
    studentCount: 28,
    subjectCount: 9,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "ICT",
    ],
  },
  {
    id: 4,
    name: "Grade 10",
    section: "B",
    academicYear: "2026 - 2027",
    teacher: "Dara Pich",
    studentCount: 29,
    subjectCount: 9,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "ICT",
    ],
  },
  {
    id: 5,
    name: "Grade 11",
    section: "A",
    academicYear: "2026 - 2027",
    teacher: "Sreynich Long",
    studentCount: 26,
    subjectCount: 10,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "ICT",
      "Economics",
    ],
  },
  {
    id: 6,
    name: "Grade 12",
    section: "A",
    academicYear: "2026 - 2027",
    teacher: "Vibol Heng",
    studentCount: 24,
    subjectCount: 10,
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
      "Literature",
      "ICT",
      "Economics",
    ],
  },
];

export default classrooms;
