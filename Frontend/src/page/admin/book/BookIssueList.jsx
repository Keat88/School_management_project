import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Trash2, BookOpen, Clock, AlertCircle } from "lucide-react";
import { api } from "../../../data/api";
import { BookIssureApi } from "../../../data/library";

export default function BookIssueList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchIssues = async () => {
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
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle size={12} /> Returned
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertCircle size={12} /> Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
        <Clock size={12} /> Issued
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 font-sans my-8 transition-all space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <BookOpen size={22} />
            </div>
            Student Book Issue Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and manage borrowed library books and returns.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/library/bookissue/add")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          Issue New Book
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 animate-fade-in border ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-lg shadow-rose-500/5"
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Table Wrapper */}
      <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 shadow-inner overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Book</th>
                <th className="px-5 py-4">Issue Date</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Return Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-slate-400">
                        Loading issued books...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen size={36} className="text-slate-600" />
                      <span className="text-sm">No issued book records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-200 whitespace-nowrap">
                      {item.student?.student_name || `Student ID: ${item.student_id}`}
                    </td>
                    <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                      {item.book?.title || `Book ID: ${item.book_id}`}
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {item.issue_date || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {item.due_date || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all text-xs font-semibold cursor-pointer active:scale-95"
                          >
                            <CheckCircle size={14} />
                            Return
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/30 text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-all text-xs font-semibold cursor-pointer active:scale-95"
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