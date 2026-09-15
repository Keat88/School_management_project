import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classRoomApi, Year } from "../../data/classrooms";
import { GraduationCap, ArrowLeft, Calendar, Layers, Hash, BookOpen } from "lucide-react";

export default function ClassForm({ classItem: propClass = null, onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const isEditMode = Boolean(propClass || id);
  const classId = propClass?.id || id;
  const [formData, setFormData] = useState({
    name: "",
    academic_year_id: "",
    grade: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!propClass && Boolean(id));
  const [feedback, setFeedback] = useState(null);

  const fetchYears = async () => {
    try {
      const response = await Year.getAll();
      setYears(response?.data?.data || response?.data || response);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (propClass) {
      populateForm(propClass);
    } else if (id) {
      classRoomApi
        .getShow(id)
        .then((response) => {
          const classDataObj = response?.data || response; 
          populateForm(classDataObj);
          setFetching(false);
        })
        .catch((error) => {
          console.error("Failed to load class details", error);
          setFetching(false);
          setFeedback({
            type: "error",
            text: "Failed to load class details for editing.",
          });
        });
    }
  }, [propClass, id]);

  const populateForm = (data) => {
    setFormData({
      name: data.name || "",
      academic_year_id: data.academic_year_id || data.year_id || "",
      grade: data.grade || "",
      section: data.section || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      if (isEditMode) {
        await classRoomApi.upDate(formData, classId);
        setFeedback({ type: "success", text: "Class updated successfully!" });
      } else {
        const response = await classRoomApi.addNew(formData);
        setFeedback({
          type: "success",
          text: response?.message || "Class created successfully!",
        });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/admin/classes"), 1000);
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-500 dark:text-slate-400 font-sans">
        <div className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">Loading class details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto rounded-lg p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800  text-gray-800 dark:text-slate-100 font-sans my-8 transition-all">
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800/80 text-gray-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer border border-gray-200 dark:border-slate-700/60 mb-3 shadow-xs active:scale-95"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <GraduationCap size={22} />
            </div>
            {isEditMode ? "Edit Class" : "Add New Class"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            {isEditMode ? "Modify existing classroom parameters." : "Register a new classroom into the system."}
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
            <BookOpen size={15} className="text-indigo-600 dark:text-indigo-400" /> Class Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
                Class Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="e.g., Grade 10 A"
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-600 dark:text-indigo-400" /> Academic Year
              </label>
              <select
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="">Select Academic Year</option>
                {Array.isArray(years) &&
                  years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Hash size={13} className="text-indigo-600 dark:text-indigo-400" /> Grade
              </label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Layers size={13} className="text-indigo-600 dark:text-indigo-400" /> Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                placeholder="e.g., A"
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700/80 rounded-xl text-sm text-gray-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {loading ? "Saving..." : isEditMode ? "Update Class" : "Save Class"}
          </button>
        </div>
      </form>
    </div>
  );
}