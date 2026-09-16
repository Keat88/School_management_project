import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Clock, BookOpen, User, GraduationCap } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      if (IsEdit) {
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
    } finally {
      setLoading(false);
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
    <div className="lg:min-w-160 mx-auto rounded-lg p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800  text-gray-800 dark:text-slate-100 font-sans my-8 transition-all">
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-100 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer border border-gray-200 dark:border-slate-700/60 mb-3 shadow-xs active:scale-95"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <Calendar size={22} />
            </div>
            {IsEdit ? "Edit Schedule" : "Add New Schedule"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            {IsEdit ? "Modify existing timetable entry parameters." : "Assign a new class timetable slot."}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-2xl text-sm font-medium flex items-center gap-3 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/5"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 shadow-lg shadow-rose-500/5"
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50/60 dark:bg-slate-950/40 p-5 rounded-2xl border border-gray-100 dark:border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800/80 flex items-center gap-2">
            <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" /> Timetable Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Room Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-blue-600 dark:text-blue-400" /> Class Room
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <BookOpen size={13} className="text-blue-500 dark:text-blue-400" /> Subject
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-indigo-600 dark:text-indigo-400" /> Teacher
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-blue-500 cursor-pointer transition-all"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-blue-500 dark:text-blue-400" /> Day of the Week
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-blue-500 dark:text-blue-400" /> Start Time
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-blue-500 dark:text-blue-400" /> End Time
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-lg text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Save size={15} /> {loading ? "Saving..." : IsEdit ? "Update Schedule" : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}