import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, AlertCircle, Save } from "lucide-react";
import { BookApi, BookCategoryApi } from "../../../data/library";
import { colorbtn, colorform } from "../../../data/datafeature";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    book_category_id: "",
    total_copies: "",
    available_copies: "",
    book_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (isEditMode && id) {
          const bookRes = BookApi.getShow
            ? await BookApi.getShow(id)
            : await BookApi.getAll().then((res) => {
                const list = res?.data?.data || res?.data || res;
                return Array.isArray(list)
                  ? list.find((b) => b.id == id)
                  : null;
              });

          const bookData = bookRes?.data?.data || bookRes?.data || bookRes;

          if (bookData) {
            setFormData({
              title: bookData.title || "",
              author: bookData.author || "",
              isbn: bookData.isbn || "",
              book_category_id: bookData.book_category_id || "",
              total_copies: bookData.total_copies || "",
              available_copies: bookData.available_copies || "",
              book_image: null,
            });
            if (bookData.book_image || bookData.image) {
              setImagePreview(bookData.book_image || bookData.image);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setFeedback({
          type: "error",
          text: "Failed to load form data.",
        });
      } finally {
        setFetching(false);
      }
    };
    loadInitialData();
  }, [id, isEditMode]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await BookCategoryApi.getAll();
        const categoryData = response?.data?.data || response?.data || response;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, book_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("isbn", formData.isbn || "");
    data.append("book_category_id", formData.book_category_id);
    data.append("total_copies", formData.total_copies);
    data.append("available_copies", formData.available_copies);

    if (formData.book_image instanceof File) {
      data.append("book_image", formData.book_image);
    }

    if (isEditMode) {
      // Method spoofing for Laravel multipart Form Data
      data.append("_method", "PUT");
    }

    try {
      if (isEditMode) {
        if (typeof BookApi.update === "function") {
          await BookApi.update(id, data);
        } else {
          await BookApi.upDate(id, data);
        }
        setFeedback({ type: "success", text: "Book updated successfully!" });
      } else {
        await BookApi.addNew(data);
        setFeedback({ type: "success", text: "Book added successfully!" });
      }

      setTimeout(() => navigate("/admin/library/books"), 1000);
    } catch (error) {
      console.error("Submission error:", error);
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
          Loading book details...
        </p>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 w-full mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            {isEditMode ? "Edit Book" : "Add New Book"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? "Modify book details, stock counts, and cover image"
              : "Register a new library book record"}
          </p>
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
            <AlertCircle
              size={18}
              className="shrink-0 text-rose-600 dark:text-rose-400"
            />
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
            Book Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={colorform.color_label}>Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
                className={colorform.color_input}
              />
            </div>
            <div>
              <label className={colorform.color_label}>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
                className={colorform.color_input}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={colorform.color_label}>ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN number"
                className={colorform.color_input}
              />
            </div>
            <div>
              <label className={colorform.color_label}>Category *</label>
              <select
                name="book_category_id"
                value={formData.book_category_id}
                onChange={handleChange}
                required
                className={colorform.color_input}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.book_category || cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={colorform.color_label}>Total Copies *</label>
              <input
                type="number"
                name="total_copies"
                value={formData.total_copies}
                onChange={handleChange}
                required
                min="1"
                placeholder="0"
                className={colorform.color_input}
              />
            </div>
            <div>
              <label className={colorform.color_label}>
                Available Copies *
              </label>
              <input
                type="number"
                name="available_copies"
                value={formData.available_copies}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className={colorform.color_input}
              />
            </div>
          </div>

          <div>
            <label className={colorform.color_label}>Book Image</label>
            <div className="flex items-center gap-4 mt-1.5">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-20 object-cover rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
                />
              )}
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors border-gray-300 hover:border-indigo-400 bg-gray-50/50 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-indigo-400">
                <Upload
                  className="text-gray-400 dark:text-slate-400 mb-1"
                  size={20}
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                  Click to upload image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
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
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Save size={16} />
            {loading ? "Saving..." : isEditMode ? "Update Book" : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
