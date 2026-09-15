import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { BookApi, BookCategoryApi } from "../../../data/library";

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
      <div className="py-12 text-center text-gray-500 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-500 dark:border-indigo-400"></div>
          <span>Loading book form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 rounded-lg border transition-colors duration-200 bg-white border-gray-200/80 text-gray-900 shadow-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
          {isEditMode ? "Edit Book" : "Add New Book"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700 flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-2.5 shadow-sm transition-all ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN number"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Category *
            </label>
            <select
              name="book_category_id"
              value={formData.book_category_id}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100"
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
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Total Copies *
            </label>
            <input
              type="number"
              name="total_copies"
              value={formData.total_copies}
              onChange={handleChange}
              required
              min="1"
              placeholder="0"
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
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
              className="w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
            Book Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-20 object-cover rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm"
              />
            )}
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-colors border-gray-300 hover:border-indigo-400 bg-gray-50/50 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-indigo-400">
              <Upload className="text-gray-400 dark:text-slate-400 mb-1" size={20} />
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
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 bg-blue-500 hover:bg-blue-700 shadow-indigo-100 dark:hover:bg-blue-500 dark:shadow-indigo-950/50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Book" : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}