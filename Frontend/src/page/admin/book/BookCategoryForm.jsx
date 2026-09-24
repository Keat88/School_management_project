import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookCategoryApi } from "../../../data/library";
import { AlertCircle, Save, ArrowLeft } from "lucide-react";
import { colorbtn, colorform } from "../../../data/datafeature";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-3 dark:text-slate-100">
        <div className="w-8 h-8 border-2 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Loading category details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 w-full mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? "Edit Book Category" : "Add New Book Category"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {isEditMode
                ? "Modify existing book category name and details"
                : "Create a new classification category for library books"}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {feedback.type === "error" && (
            <AlertCircle size={18} className="shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-2 border-b border-gray-100 dark:border-slate-800">
            Category Information
          </h3>
          <div>
            <label className={colorform.color_label}>
              Category Name *
            </label>
            <input
              type="text"
              name="book_category"
              value={formData.book_category}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="e.g., Science Fiction"
              className={colorform.color_input}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
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