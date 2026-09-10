import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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
          classes: data?.class || data?.data?.class || [],
          subjects: data?.subject || data?.data?.subject || [],
          teachers: data?.teacher || data?.data?.teacher || [],
        });
      }
    } catch (error) {
      console.error("Failed to load dropdown options", error);
    }
  };

  const fetchUpdate = async (recordId) => {
    try {
      const response = await api.get(`/timetable/show/${recordId}`);
      const time = response.data?.data || response.data;
      if (time) {
        setFormData({
          class_id: time.class_id || "",
          subject_id: time.subject_id || "",
          teacher_id: time.teacher_id || "",
          day: time.day || "",
          start_time: time.start_time || "",
          end_time: time.end_time || "",
        });
      }
    } catch (error) {
      console.error("Failed to load timetable record for editing", error);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (IsEdit && id) {
      fetchUpdate(id);
    }
  }, [id, IsEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      if (IsEdit) {
        // Using PUT or POST depending on your backend route definition
        const response = await api.put(`/timetable/update/${id}`, formData);
        setFeedback({
          type: "success",
          text: response.data.message || "Schedule updated successfully!",
        });
      } else {
        const response = await api.post("/timetable/store", formData);
        setFeedback({
          type: "success",
          text: response.data.message || "Schedule created successfully!",
        });
        if (response.data.status || response.status === 200 || response.status === 201) {
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
        text: error.response?.data?.message || "Validation error or server failure.",
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
    <div className="lg:min-w-160 mx-auto rounded-lg p-6 bg-slate-800 border border-slate-700 shadow-xl text-slate-100 font-sans my-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer border border-slate-700 mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h3 className="text-xl font-bold text-white">
            {IsEdit ? "Edit Schedule" : "Add New Schedule"}
          </h3>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-5 rounded-xl text-sm font-medium ${
            feedback.type === "success" 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Class Room Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Class Room
          </label>
          <select
            name="class_id"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Subject
          </label>
          <select
            name="subject_id"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Teacher
          </label>
          <select
            name="teacher_id"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Day of the Week
          </label>
          <select
            name="day"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
          <button
            type="button"
            className="px-4 py-2 bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
          >
            <Save size={14} /> {IsEdit ? "Update Schedule" : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}