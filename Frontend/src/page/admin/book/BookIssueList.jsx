import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CheckCircle, Trash2, BookOpen } from "lucide-react";
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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Returned
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        Issued
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Student Book Issue Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track and manage borrowed library books and returns.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/library/bookissue/add")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Issue New Book
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Main Table Wrapper */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Book</th>
                <th className="px-4 py-3.5">Issue Date</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5">Return Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-gray-600">
                        Loading issued books...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen size={32} className="text-gray-300" />
                      <span>No issued book records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                      {item.student?.student_name || `Student ID: ${item.student_id}`}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {item.book?.title || `Book ID: ${item.book_id}`}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {item.issue_date || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {item.due_date || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {item.return_date || "-"}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusBadge(item.status, item.due_date)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "returned" && (
                          <button
                            type="button"
                            onClick={() => handleReturn(item.id)}
                            title="Mark as Returned"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-medium"
                          >
                            <CheckCircle size={14} />
                            Return
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-rose-200 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors text-xs font-medium"
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