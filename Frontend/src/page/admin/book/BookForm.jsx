import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
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
        if (isEditMode) {
          const bookRes = (await BookApi.getShow)
            ? await BookApi.getShow(id)
            : await BookApi.getAll().then((res) =>
                (res.data || res).find((b) => b.id == id),
              );
          const bookData = bookRes?.data || bookRes;

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
            if (bookData.book_image) {
              setImagePreview(bookData.book_image);
            }
          }
        }
      } catch (error) {
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

  const fetchCategories = async () => {
    const response = await BookCategoryApi.getAll();
    setCategories(response?.data || response || response?.data.data);
  };
  useEffect(() => {
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
    data.append("isbn", formData.isbn);
    data.append("book_category_id", formData.book_category_id);
    data.append("total_copies", formData.total_copies);
    data.append("available_copies", formData.available_copies);

    if (formData.book_image instanceof File) {
      data.append("book_image", formData.book_image);
    }

    if (isEditMode) {
      data.append("_method", "PUT");
    }

    try {
      if (isEditMode) {
        (await BookApi.update)
          ? await BookApi.update(id, data)
          : await BookApi.addNew(data); // Adjust based on your API setup for multipart updates
        setFeedback({ type: "success", text: "Book updated successfully!" });
      } else {
        await BookApi.addNew(data);
        setFeedback({ type: "success", text: "Book added successfully!" });
      }

      setTimeout(() => navigate("/books"), 1000);
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
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading book form...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200  space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? "Edit Book" : "Add New Book"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category *
            </label>
            <select
              name="book_category_id"
              value={formData.book_category_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.book_category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Book Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-20 object-cover rounded border border-gray-200"
              />
            )}
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors">
              <Upload className="text-gray-400 mb-1" size={20} />
              <span className="text-xs text-gray-500 font-medium">
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

        <div className="flex justify-end gap-2 pt-4">
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
            {loading ? "Saving..." : isEditMode ? "Update Book" : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
