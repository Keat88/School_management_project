import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ScheduleForm() {
  const { id } = useParams();
  const IsEdit = Boolean(id);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
    day: "",
    start_time: "",
    end_time: "",
  });
  const [dropdowns, setDropdowns] = useState({
    classes: [],
    subjects: [],
    teachers: [],
  });
  const [feedback, setFeedback] = useState(null);
  const fetchOptions = async () => {
    try {
      const result = await api.get("/form-schedult");
      const data = result.data;
      if (data) {
        setDropdowns({
          classes: data?.class || data?.data.class || [],
          subjects: data?.subject || data?.data.subject || [],
          teachers: data?.teacher || data?.data.teacher || [],
        });
      }
    } catch (error) {
      console.error("Failed to load dropdown options", error);
    }
  };
  const fetchUpdate = async (id) => {
    const response = await api.get(`/timetable/show/${id}`);
    const time = response.data;
    setFormData({
      class_id: time.class_id,
      subject_id: "",
      teacher_id: "",
      day: "",
      start_time: "",
      end_time: "",
    });
  };
  useEffect(() => {
    fetchOptions();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (IsEdit) {
        const response = await api.post(`/timetable/update/${id}`, formData);
        setFeedback({
          type: "success",
          text: response.data.message,
        });
      } else {
        const response = await api.post("/timetable/store", formData);
        setFeedback({
          type: "success",
          text: response.data.message,
        });
        if (response.data.status) {
          setFormData({
            class_id: "",
            subject_id: "",
            teacher_id: "",
            day: "",
            start_time: "",
            end_time: "",
          });
        }
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text: "Validation error or server failure.",
      });
    }
  };
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-w-160 mx-auto rounded-lg p-4 border border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        {IsEdit ? "Edit Schedule" : "Add New Schedule"}
      </h3>

      {feedback && (
        <div
          className={`p-4 mb-4 rounded-md ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Class Room Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class Room
          </label>
          <select
            name="class_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.class_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Class Room</option>
            {dropdowns.classes.map((cls) => (
              <option key={cls.id_class} value={cls.id_class}>
                {cls.name_class}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            name="subject_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.subject_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {dropdowns.subjects.map((sub) => (
              <option key={sub.id_subject} value={sub.id_subject}>
                {sub.name_subject}
              </option>
            ))}
          </select>
        </div>

        {/* Teacher Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher
          </label>
          <select
            name="teacher_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.teacher_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Teacher</option>
            {dropdowns.teachers.map((teacher) => (
              <option key={teacher.id_teacher} value={teacher.id_teacher}>
                {teacher.name_teacher}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day of the Week
          </label>
          <select
            name="day"
            className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
            value={formData.day}
            onChange={handleChange}
            required
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {IsEdit ? "Update Schedule" : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
