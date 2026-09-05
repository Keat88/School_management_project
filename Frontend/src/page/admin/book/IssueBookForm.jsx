import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../data/api";
import { studentData } from "../../../data/StudentsApi";
import { BookApi, BookIssureApi } from "../../../data/library";

export default function IssueBookForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    book_id: "",
    student_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = await studentData.getAll();
        const books = await BookApi.getAll();
        setBooks(books?.data || books);
        setStudents(student?.data || student);
      } catch (error) {
        console.log("Error fetching dropdown data:", error);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for field when user updates it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    setErrors({});

    try {
     const response = await BookIssureApi.addNew(formData)
      setFeedback({ type: "success", text: response?.message });
      setTimeout(() => navigate("/library/bookissue"), 1000);
    } catch (error) {
      if (error.response?.status === 422) {
        // Handle Laravel 422 validation errors map
        setErrors(error.response.data.errors || {});
      }
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to issue book. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-160 mx-auto p-6 bg-white rounded-xl border border-gray-200  space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {feedback &&
        feedback.type === "error" &&
        Object.keys(errors).length === 0 && (
          <div className="p-4 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200">
            {feedback.text}
          </div>
        )}

      {feedback && feedback.type === "success" && (
        <div className="p-4 rounded-lg text-sm font-medium bg-green-50 text-green-600 border border-green-200">
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Book *
          </label>
          <select
            name="book_id"
            value={formData.book_id}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.book_id
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-blue-500"
            }`}
          >
            <option value="">-- Choose a Book --</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.author || "Unknown"})
              </option>
            ))}
          </select>
          {errors.book_id && (
            <p className="mt-1 text-xs text-red-500">{errors.book_id[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Student *
          </label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
              errors.student_id
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-blue-500"
            }`}
          >
            <option value="">-- Choose a Student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_name}
              </option>
            ))}
          </select>
          {errors.student_id && (
            <p className="mt-1 text-xs text-red-500">{errors.student_id[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Issue Date *
            </label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.issue_date
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.issue_date && (
              <p className="mt-1 text-xs text-red-500">
                {errors.issue_date[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              min={formData.issue_date}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                errors.due_date
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.due_date && (
              <p className="mt-1 text-xs text-red-500">{errors.due_date[0]}</p>
            )}
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
            {loading ? "Issuing..." : "Issue Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
