import { api } from "./api";

const TODAY = new Date().toISOString().slice(0, 10);

// audience: "all" | "students" | "teachers" | "parents"
// status:   "published" | "scheduled" | "draft"

export const NoticeApi = {
  getAll: async (param) => {
    try {
      const response = await api.get("/notice/index",param );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/notice/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (param) => {
    try {
      const response = await api.post(
        "/notice/store",
         param ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  update: async (param, id) => {
    try {
      const response = await api.post(
        `/notice/update/${id}`,
        { param },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/notice/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
const notices = [
  {
    id: 1,
    title: "Mid-term exam schedule released",
    content:
      "The mid-term examination schedule for all grades has been finalized and is now available on the school portal. Please review your exam dates and arrive at least 15 minutes early.",
    audience: "students",
    status: "published",
    publishDate: TODAY,
  },
  {
    id: 2,
    title: "Parent-teacher meeting on Sep 5",
    content:
      "We invite all parents to attend the upcoming parent-teacher meeting to discuss student progress for this term. Sessions will be held by appointment.",
    audience: "parents",
    status: "published",
    publishDate: TODAY,
  },
  {
    id: 3,
    title: "Staff development workshop",
    content:
      "All teaching staff are required to attend the professional development workshop on new curriculum standards, taking place in the main auditorium.",
    audience: "teachers",
    status: "scheduled",
    publishDate: "2026-09-03",
  },
  {
    id: 4,
    title: "Library closed for maintenance",
    content:
      "The school library will be closed for routine maintenance and inventory checks. Students are encouraged to return borrowed books before the closure.",
    audience: "all",
    status: "published",
    publishDate: "2026-08-26",
  },
  {
    id: 5,
    title: "New grading policy update",
    content:
      "An updated grading policy will take effect starting next term. Draft details are being finalized with the academic committee before publishing.",
    audience: "teachers",
    status: "draft",
    publishDate: null,
  },
  {
    id: 6,
    title: "School sports day announcement",
    content:
      "Get ready for the annual sports day! Events, team assignments, and schedules will be shared with students and parents closer to the date.",
    audience: "all",
    status: "scheduled",
    publishDate: "2026-09-10",
  },
  {
    id: 7,
    title: "Fee payment reminder for Term 2",
    content:
      "This is a reminder that Term 2 fee payments are due by the end of this month. Please contact the finance office for any payment plan inquiries.",
    audience: "parents",
    status: "published",
    publishDate: "2026-08-20",
  },
  {
    id: 8,
    title: "Draft: Holiday calendar proposal",
    content:
      "Proposed academic holiday calendar for the next school year is under internal review before being shared publicly.",
    audience: "all",
    status: "draft",
    publishDate: null,
  },
];

export default notices;
