import { useState } from "react";
import { Layers, Save, AlertCircle, CheckCircle, X } from "lucide-react";
import { api } from "../../../../data/api";
import { useNavigate } from "react-router-dom";

export default function CourseCategoryForm({ isDark = false, onSuccess }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/course-categories", { name, icon });
      if (response.data.status === "success") {
        setSuccess(true);
        setName("");
        setIcon("");
        if (onSuccess) onSuccess(response.data.data);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Failed to create category.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`space-y-6 lg:min-w-160 mx-auto p-6 rounded-2xl border shadow-xs ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            <Layers className="text-blue-600" size={22} />
            Create Course Category
          </h2>
          <p
            className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Add a new category to organize your courses.
          </p>
        </div>
      </div>

      {error && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
            isDark
              ? "bg-red-950/50 text-red-400 border-red-900/60"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
            isDark
              ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/60"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          <CheckCircle size={16} />
          Category created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Category Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-blue-900 focus:border-blue-500"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600"
            }`}
          />
        </div>

        <div>
          <label
            className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Icon Class / Identifier
          </label>
          <input
            type="text"
            placeholder="e.g. code, laptop, or icon name"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-blue-900 focus:border-blue-500"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600"
            }`}
          />
          <p
            className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Optional. Used for rendering category icons in the frontend UI.
          </p>
        </div>

        <div
          className={`pt-4 border-t flex justify-end gap-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50 ${
              isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
