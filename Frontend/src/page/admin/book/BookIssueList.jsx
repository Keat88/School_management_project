import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Trash2, BookOpen, Clock, AlertCircle, Sun, Moon } from "lucide-react";
import { api } from "../../../data/api";
import { BookIssureApi } from "../../../data/library";

export default function BookIssueList({ isDark: propIsDark = true }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Sync with localStorage changes across components/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark" || savedTheme === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    localStorage.setItem("darkMode", newTheme ? "true" : "false");
  };

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

  // Auto-clear feedback notification after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleReturn = async (id) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await BookIssureApi.ReturnIssurce(id, { return_date: today });
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-emerald-100 text-emerald-700 border-emerald-200"
        }`}>
          <CheckCircle size={12} /> Returned
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          isDark
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
            : "bg-amber-100 text-amber-700 border-amber-200"
        }`}>
          <AlertCircle size={12} /> Overdue
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
        isDark
          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
          : "bg-indigo-100 text-indigo-700 border-indigo-200"
      }`}>
        <Clock size={12} /> Issued
      </span>
    );
  };

  return (
    <div
      className={`lg:min-w-160 mx-auto rounded-lg p-6 sm:p-8 font-sans my-8 transition-colors space-y-6 ${
        isDark
          ? "bg-slate-900 border border-slate-800 text-slate-100"
          : "bg-white border border-slate-200 text-slate-900"
      }`}
    >
      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight flex items-center gap-2.5 ${isDark ? "text-white" : "text-slate-900"}`}>
            <div className={`p-2 rounded-xl border ${isDark ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400" : "bg-indigo-100 border-indigo-200 text-indigo-600"}`}>
              <BookOpen size={22} />
            </div>
            Student Book Issue Management
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Track and manage borrowed library books and returns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 border shadow-sm ${
              isDark
                ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
            }`}
          >
            {isDark ? (
              <>
                <Moon size={15} className="text-indigo-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun size={15} className="text-amber-500" />
                <span>Light</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/library/bookissue/add")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            Issue New Book
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 border shadow-sm ${
            feedback.type === "success"
              ? isDark
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/5"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isDark
              ? "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/5"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Table Wrapper */}
      <div className={`rounded-2xl border shadow-inner overflow-hidden ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${isDark ? "bg-slate-900/80 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Book</th>
                <th className="px-5 py-4">Issue Date</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Return Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className={`px-4 py-16 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Loading issued books...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`px-4 py-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen size={36} className={isDark ? "text-slate-600" : "text-slate-400"} />
                      <span className="text-sm">No issued book records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${isDark ? "hover:bg-slate-900/60" : "hover:bg-slate-50/80"}`}
                  >
                    <td className={`px-5 py-4 font-semibold whitespace-nowrap ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {item.student?.student_name || `Student ID: ${item.student_id}`}
                    </td>
                    <td className={`px-5 py-4 whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {item.book?.title || `Book ID: ${item.book_id}`}
                    </td>
                    <td className={`px-5 py-4 whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {item.issue_date || "-"}
                    </td>
                    <td className={`px-5 py-4 whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {item.due_date || "-"}
                    </td>
                    <td className={`px-5 py-4 whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>
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
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
                              isDark
                                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            <CheckCircle size={14} />
                            Return
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
                            isDark
                              ? "border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                              : "border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100"
                          }`}
                        >
                          <Trash2 size={14} />
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
  );
}