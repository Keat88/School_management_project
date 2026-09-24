import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classRoomApi, Year } from "../../data/classrooms";
import {
  GraduationCap,
  Calendar,
  Layers,
  Hash,
  BookOpen,
  Save,
} from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs text-gray-900 dark:text-slate-100 font-sans my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <GraduationCap size={20} />
            </div>
            {isEditMode ? "Edit Class" : "Add New Class"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditMode
              ? "Modify existing classroom parameters."
              : "Register a new classroom into the system."}
          </p>
        </div>
      </div>

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
        {/* Class Information Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <BookOpen size={15} className="text-blue-500 dark:text-blue-400" />{" "}
            Class Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={colorform.color_label}>Class Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="e.g., Grade 10 A"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Academic Year *</label>
              <select
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="" className="dark:bg-slate-800">
                  Select Academic Year
                </option>
                {Array.isArray(years) &&
                  years.map((y) => (
                    <option
                      key={y.id}
                      value={y.id}
                      className="dark:bg-slate-800"
                    >
                      {y.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={colorform.color_label}>Grade *</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Section *</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                placeholder="e.g., A"
                className={colorform.color_input}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={colorbtn.btncancel}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Save size={16} />
            {loading ? "Saving..." : isEditMode ? "Update Class" : "Save Class"}
          </button>
        </div>
      </form>
    </div>
  );
}
