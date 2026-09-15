import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CheckCircle,
  Trash2,
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../data/api";
import { BookIssureApi } from "../../../data/library";

export default function BookIssueList({ isDark: propIsDark = true }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme =
        localStorage.getItem("theme") || localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark" || savedTheme === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const response = await BookIssureApi.getAll();
      const result = response.data?.data || response.data || response;
      setIssues(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching issued books:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleReturn = async (id) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await BookIssureApi.ReturnIssurce(id, {
        return_date: today,
      });
      setFeedback({
        type: "success",
        text: response?.message || "Book successfully marked as returned!",
      });
      fetchIssues();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to process book return.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue record?")) {
      return;
    }
    try {
      await api.delete(`/library/issues/${id}`);
      setFeedback({ type: "success", text: "Record deleted successfully!" });
      setIssues((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete record.",
      });
    }
  };

  const getStatusBadge = (status, dueDate) => {
    const isOverdue =
      status !== "returned" && dueDate && new Date(dueDate) < new Date();

    if (status === "returned") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
          <CheckCircle
            size={12}
            className="text-emerald-500 dark:text-emerald-400"
          />{" "}
          Returned
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
          <AlertCircle
            size={12}
            className="text-amber-500 dark:text-amber-400"
          />{" "}
          Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-indigo-100 text-blue-700 border-indigo-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800">
        <Clock size={12} className="text-blue-500 dark:text-cyan-400" /> Issued
      </span>
    );
  };

  return (
    <>
      <div className="lg:min-w-160 mx-auto  p-6 sm:p-8 font-sans ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800 lg:min-w-160">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="p-2.5 rounded-xl border bg-blue-100 border-blue-200 text-blue-600 dark:bg-cyan-500/10 dark:border-cyan-500/20">
                <BookOpen size={22} />
              </div>
              Student Book Issue Management
            </h2>
            <p className="text-xs sm:text-sm mt-1.5 text-slate-500 dark:text-slate-400">
              Track and manage borrowed library books and returns.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/admin/library/bookissue/add")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold shadow-lg transition-all cursor-pointer active:scale-95 bg-blue-500 text-white hover:bg-blue-700   dark:to-blue-600  dark:hover:to-blue-500  "
            >
              <Plus size={16} />
              Issue New Book
            </button>
          </div>
        </div>
        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border shadow-sm ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60"
            }`}
          >
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Main Table Wrapper */}
        <div className="rounded-lg overflow-hidden  dark:bg-slate-950 dark:border-slate-800 bg-white ">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Book</th>
                  <th className="px-5 py-4">Issue Date</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4">Return Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm divide-slate-200 dark:divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center text-slate-500 dark:text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          Loading issued books...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : issues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center text-slate-400 dark:text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BookOpen
                          size={36}
                          className="text-slate-400 dark:text-slate-600"
                        />
                        <span className="text-sm">
                          No issued book records found.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  issues.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <td className="px-5 py-4 font-semibold whitespace-nowrap text-slate-800 dark:text-slate-200">
                        {item.student?.student_name ||
                          `Student ID: ${item.student_id}`}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {item.book?.title || `Book ID: ${item.book_id}`}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {item.issue_date || "-"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {item.due_date || "-"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {item.return_date || "-"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status, item.due_date)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {item.status !== "returned" && (
                            <button
                              type="button"
                              onClick={() => handleReturn(item.id)}
                              title="Mark as Returned"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all text-xs font-semibold cursor-pointer active:scale-95 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-800/60 dark:text-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50"
                            >
                              <CheckCircle
                                size={14}
                                className="text-emerald-500 dark:text-emerald-400"
                              />
                              Return
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Record"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all text-xs font-semibold cursor-pointer active:scale-95 border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 dark:border-rose-800/60 dark:text-rose-300 dark:bg-rose-950/40 dark:hover:bg-rose-900/50"
                          >
                            <Trash2
                              size={14}
                              className="text-rose-500 dark:text-rose-400"
                            />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
