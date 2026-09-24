import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Calendar, GraduationCap } from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";

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
        setTimeout(() => {
          navigate(-1);
        }, 1200);
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
    <div className="lg:min-w-160  mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs text-gray-900 dark:text-slate-100 font-sans my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Calendar size={20} />
            </div>
            {IsEdit ? "Edit Schedule Entry" : "Add New Schedule Entry"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {IsEdit ? "Modify existing timetable entry parameters." : "Assign a new class timetable slot."}
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <GraduationCap size={15} className="text-blue-500 dark:text-blue-400" /> Timetable Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Room Selection */}
            <div>
              <label className={colorform.color_label}>
                Class Room *
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="">-- Choose Class Room --</option>
                {dropdowns.classes.map((cls) => (
                  <option key={cls.id_class} value={cls.id_class}>
                    {cls.name_class}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className={colorform.color_label}>
                Subject *
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="">-- Choose Subject --</option>
                {dropdowns.subjects.map((sub) => (
                  <option key={sub.id_subject} value={sub.id_subject}>
                    {sub.name_subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Selection */}
            <div>
              <label className={colorform.color_label}>
                Teacher *
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="">-- Choose Teacher --</option>
                {dropdowns.teachers.map((teacher) => (
                  <option key={teacher.id_teacher} value={teacher.id_teacher}>
                    {teacher.name_teacher}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Selection */}
            <div>
              <label className={colorform.color_label}>
                Day of the Week *
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="">-- Choose Day --</option>
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className={colorform.color_label}>
                Start Time *
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className={colorform.color_input}
              />
            </div>

            {/* End Time */}
            <div>
              <label className={colorform.color_label}>
                End Time *
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className={colorform.color_input}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={colorbtn.btnsave}
          >
            <Save size={16} /> 
            {loading ? "Saving..." : IsEdit ? "Update Schedule" : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}