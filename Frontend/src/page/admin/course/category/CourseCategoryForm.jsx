import { useState, useEffect } from "react";
import { Layers, Save, AlertCircle, CheckCircle, X } from "lucide-react";
import { api } from "../../../../data/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseCategoryForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/course-categories/${id}`);
          if (res.data.status === "success") {
            setName(res.data.data.name);
            setIcon(res.data.data.icon || "");
          }
        } catch (err) {
          console.error("Failed to load category:", err);
          setError("Failed to load category details for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = isEditMode
        ? await api.put(`/course-categories/${id}`, { name, icon })
        : await api.post("/course-categories", { name, icon });

      if (response.data.status === "success") {
        setSuccess(true);
        if (onSuccess) onSuccess(response.data.data);
        setTimeout(() => {
          setSuccess(false);
          navigate(-1);
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(
          err.response?.data?.message ||
            (isEditMode
              ? "Failed to update category."
              : "Failed to create category."),
        );
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 lg:min-w-160 mx-auto p-6 sm:p-8 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
            <Layers className="text-blue-600 dark:text-indigo-400" size={22} />
            {isEditMode ? "Edit Course Category" : "Create Course Category"}
          </h2>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            {isEditMode
              ? "Modify the selected course category details."
              : "Add a new category to organize your courses."}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border text-xs font-medium bg-red-50 dark:bg-rose-500/10 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-500/20">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
          <CheckCircle size={16} className="shrink-0" />
          {isEditMode
            ? "Category updated successfully!"
            : "Category created successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
            Category Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-500/30 focus:border-blue-600 dark:focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
            Icon Class / Identifier
          </label>
          <input
            type="text"
            placeholder="e.g. code, laptop, or icon name"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-500/30 focus:border-blue-600 dark:focus:border-indigo-500"
          />
          <p className="text-xs mt-1.5 text-slate-400 dark:text-slate-500">
            Optional. Used for rendering category icons in the frontend UI.
          </p>
        </div>

        <div className="pt-5 border-t flex justify-end gap-3 border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700/80"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Category"
                : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
