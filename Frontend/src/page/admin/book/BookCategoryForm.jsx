import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookCategoryApi } from "../../../data/library";
import { AlertCircle } from "lucide-react";

export default function BookCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    book_category: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isEditMode && id) {
      setFetching(true);
      BookCategoryApi.getShow(id)
        .then((response) => {
          const payload = response?.data?.data || response?.data || response;
          setFormData({
            book_category: payload.book_category || payload.name || "",
          });
        })
        .catch((error) => {
          console.error("Failed to load category details", error);
          setFeedback({
            type: "error",
            text: "Failed to load category details for editing.",
          });
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isEditMode) {
        await BookCategoryApi.upDate(id, formData);
        setFeedback({
          type: "success",
          text: "Category updated successfully!",
        });
      } else {
        await BookCategoryApi.addNew(formData);
        setFeedback({
          type: "success",
          text: "Category added successfully!",
        });
      }

      setTimeout(() => navigate("/admin/library/category"), 1000);
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
      <div className="py-12 text-center text-gray-500 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-500 dark:border-indigo-400"></div>
          <span>Loading book categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8  border transition-colors duration-200 bg-white border-gray-200/80 text-gray-900 shadow-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:shadow-slate-950/40">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">
          {isEditMode ? "Edit Book Category" : "Add New Book Category"}
        </h2>
        
      </div>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-xl text-sm font-medium border flex items-center gap-2.5 shadow-sm transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40"
          }`}
        >
          {feedback.type === "error" && <AlertCircle size={18} className="shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider pb-2 border-b text-blue-500 border-gray-100 dark:text-blue-400 dark:border-slate-800">
            Category Information
          </h3>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Category Name
            </label>
            <input
              type="text"
              name="book_category"
              value={formData.book_category}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="e.g., Science Fiction"
              className="w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-gray-100 dark:border-slate-800 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 bg-blue-500 hover:bg-blue-600 shadow-indigo-100 dark:hover:bg-blue-500 dark:shadow-indigo-950/50"
          >
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