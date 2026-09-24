import { useState, useEffect } from "react";
import { classRoomApi } from "../../data/classrooms";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Calendar, Save, BookOpen } from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";

export default function ClassRoomForm({ item = null, onSuccess }) {
  const isEdit = Boolean(item);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
    grade: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Populate form fields if editing an existing record
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || item.academic_year?.name || "",
        start_date: item.start_date || item.academic_year?.start_date || "",
        end_date: item.end_date || item.academic_year?.end_date || "",
        is_current: item.is_current ?? item.academic_year?.is_current ?? false,
        grade: item.grade || "",
        section: item.section || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isEdit) {
        await classRoomApi.upDate(item.id, formData);
        setFeedback({ type: "success", text: "Class updated successfully!" });
      } else {
        await classRoomApi.addNew(formData);
        setFeedback({ type: "success", text: "Class created successfully!" });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate(-1);
        }, 1200);
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs text-gray-900 dark:text-slate-100 font-sans my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <GraduationCap size={20} />
            </div>
            {isEdit ? "Edit Class & Academic Year" : "Add New Class & Academic Year"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEdit ? "Modify existing classroom and academic year parameters." : "Configure a new academic year and classroom section."}
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
        {/* Academic Year Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <Calendar size={15} className="text-blue-500 dark:text-blue-400" /> Academic Year Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={colorform.color_label}>Academic Year Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 2025-2026"
                required
                className={colorform.color_input}
              />
            </div>

            <div>
              <label className={colorform.color_label}>Start Date *</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className={`${colorform.color_input} dark:[color-scheme:dark]`}
              />
            </div>

            <div>
              <label className={colorform.color_label}>End Date *</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className={`${colorform.color_input} dark:[color-scheme:dark]`}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="is_current"
                id="is_current"
                checked={formData.is_current}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-700 rounded focus:ring-blue-500 bg-gray-50 dark:bg-slate-800"
              />
              <label htmlFor="is_current" className="text-sm font-medium text-gray-700 dark:text-slate-300 select-none">
                Set as Current Academic Year
              </label>
            </div>
          </div>
        </div>

        {/* Classroom Section */}
        <div className="bg-gray-50/60 dark:bg-slate-800/50 p-5 rounded-xl border border-gray-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 pb-2 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2">
            <BookOpen size={15} className="text-blue-500 dark:text-blue-400" /> Classroom Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={colorform.color_label}>Grade *</label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
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
                placeholder="e.g. A"
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
            {loading ? "Saving..." : isEdit ? "Update Class" : "Save Class"}
          </button>
        </div>
      </form>
    </div>
  );
}