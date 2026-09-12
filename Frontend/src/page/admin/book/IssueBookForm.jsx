import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { studentData } from "../../../data/StudentsApi";
import { BookApi, BookIssureApi } from "../../../data/library";

export default function IssueBookForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
        const studentResponse = await studentData.getAll();
        const booksResponse = await BookApi.getAll();

        const rawStudents =
          studentResponse?.data?.data ||
          studentResponse?.data ||
          studentResponse;
        const rawBooks =
          booksResponse?.data?.data || booksResponse?.data || booksResponse;

        setStudents(Array.isArray(rawStudents) ? rawStudents : []);
        setBooks(Array.isArray(rawBooks) ? rawBooks : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await BookIssureApi.addNew(formData);
      setFeedback({
        type: "success",
        text: response?.message || "Book issued successfully!",
      });
      setTimeout(() => navigate("/admin/library/bookissue"), 1000);
    } catch (error) {
      if (error.response?.status === 422) {
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

  if (fetching) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-500 dark:border-indigo-400"></div>
          <span>Loading issue book form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:min-160 mx-auto p-6 sm:p-8 rounded-lg border transition-colors duration-200 bg-white border-gray-200/80 text-gray-900 shadow-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
          Issue Book
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700 flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {feedback &&
        feedback.type === "error" &&
        Object.keys(errors).length === 0 && (
          <div className="p-4 rounded-xl text-sm font-medium border flex items-center gap-2.5 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40">
            <AlertCircle size={18} className="shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

      {feedback && feedback.type === "success" && (
        <div className="p-4 rounded-xl text-sm font-medium border flex items-center gap-2.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40">
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
            Select Book *
          </label>
          <select
            name="book_id"
            value={formData.book_id}
            onChange={handleChange}
            required
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50/50 text-gray-900 dark:bg-slate-800/80 dark:text-slate-100 ${
              errors.book_id
                ? "border-rose-500 focus:ring-rose-500/40 dark:border-rose-500"
                : "border-gray-300 focus:ring-indigo-500/45 focus:border-indigo-500 dark:border-slate-700/80"
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
            <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
              {errors.book_id[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
            Select Student *
          </label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50/50 text-gray-900 dark:bg-slate-800/80 dark:text-slate-100 ${
              errors.student_id
                ? "border-rose-500 focus:ring-rose-500/40 dark:border-rose-500"
                : "border-gray-300 focus:ring-indigo-500/45 focus:border-indigo-500 dark:border-slate-700/80"
            }`}
          >
            <option value="">-- Choose a Student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_name ||
                  student.name ||
                  `Student #${student.id}`}
              </option>
            ))}
          </select>
          {errors.student_id && (
            <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
              {errors.student_id[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Issue Date *
            </label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              required
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50/50 text-gray-900 dark:bg-slate-800/80 dark:text-slate-100 ${
                errors.issue_date
                  ? "border-rose-500 focus:ring-rose-500/40 dark:border-rose-500"
                  : "border-gray-300 focus:ring-indigo-500/45 focus:border-indigo-500 dark:border-slate-700/80"
              }`}
            />
            {errors.issue_date && (
              <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                {errors.issue_date[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-700 dark:text-slate-300">
              Due Date *
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              min={formData.issue_date}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 bg-gray-50/50 text-gray-900 dark:bg-slate-800/80 dark:text-slate-100 ${
                errors.due_date
                  ? "border-rose-500 focus:ring-rose-500/40 dark:border-rose-500"
                  : "border-gray-300 focus:ring-indigo-500/45 focus:border-indigo-500 dark:border-slate-700/80"
              }`}
            />
            {errors.due_date && (
              <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                {errors.due_date[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-gray-100 dark:border-slate-800 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 dark:hover:bg-indigo-500 dark:shadow-indigo-950/50"
          >
            {loading ? "Issuing..." : "Issue Book"}
          </button>
        </div>
      </form>
    </div>
  );
}