import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookCategoryApi } from "../../../data/library";

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
    if (isEditMode) {
      BookCategoryApi
        .getShow(id)
        .then((response) => {
          const data = response?.data || response;
          setFormData({
            book_category: data.book_category || "",
          });
          setFetching(false);
        })
        .catch((error) => {
          console.error("Failed to load category details", error);
          setFetching(false);
          setFeedback({
            type: "error",
            text: "Failed to load category details for editing.",
          });
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
        await BookCategoryApi.update(id, formData);
        setFeedback({ type: "success", text: "Category updated successfully!" });
      } else {
        await BookCategoryApi.addNew(formData);
        setFeedback({ type: "success", text: "Category added successfully!" });
      }

      setTimeout(() => navigate("/book-categories"), 1000);
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
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading category details...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? "Edit Book Category" : "Add New Book Category"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1"
        >
          <span>← Back</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Category Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}