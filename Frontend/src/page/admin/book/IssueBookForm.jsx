import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Save } from "lucide-react";
import { studentData } from "../../../data/StudentsApi";
import { BookApi, BookIssureApi } from "../../../data/library";
import { colorbtn, colorform } from "../../../data/datafeature";

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center space-y-3 dark:text-slate-100">
        <div className="w-8 h-8 border-2 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Loading issue form details...
        </p>
      </div>
    );
  }

  // Helper to append error borders onto the shared colorform input class
  const getInputClass = (hasError) => {
    return `${colorform.color_input} ${
      hasError
        ? "!border-rose-500 !focus:ring-rose-500/40 dark:!border-rose-500"
        : ""
    }`;
  };

  return (
    <div className="lg:min-w-160 w-full mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Issue Book
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Assign and record a book issuance to an active student
          </p>
        </div>
      </div>

      {/* Feedback Banners */}
      {feedback &&
        feedback.type === "error" &&
        Object.keys(errors).length === 0 && (
          <div className="p-4 rounded-xl text-sm font-medium border flex items-center gap-3 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
            <AlertCircle
              size={18}
              className="shrink-0 text-rose-600 dark:text-rose-400"
            />
            <span>{feedback.text}</span>
          </div>
        )}

      {feedback && feedback.type === "success" && (
        <div className="p-4 rounded-xl text-sm font-medium border flex items-center gap-3 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
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
            Issuance Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={colorform.color_label}>Select Book *</label>
              <select
                name="book_id"
                value={formData.book_id}
                onChange={handleChange}
                required
                className={getInputClass(errors.book_id)}
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
              <label className={colorform.color_label}>Select Student *</label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                className={getInputClass(errors.student_id)}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={colorform.color_label}>Issue Date *</label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                className={getInputClass(errors.issue_date)}
              />
              {errors.issue_date && (
                <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                  {errors.issue_date[0]}
                </p>
              )}
            </div>

            <div>
              <label className={colorform.color_label}>Due Date *</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                min={formData.issue_date}
                className={getInputClass(errors.due_date)}
              />
              {errors.due_date && (
                <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                  {errors.due_date[0]}
                </p>
              )}
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
            {loading ? "Issuing..." : "Issue Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
