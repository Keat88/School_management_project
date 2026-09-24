import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  CheckCircle,
  Trash2,
  BookOpen,
  Clock,
  AlertCircle,
  Search,
  RotateCcw,
  AlertTriangle,
  Filter,
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

  // Search and Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setIssueToDelete(id);
    setIsDeleteModalOpen(true);
    setFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!issueToDelete) return;
    try {
      await api.delete(`/library/issues/${issueToDelete}`);
      setFeedback({ type: "success", text: "Record deleted successfully!" });
      setIssues((prev) => prev.filter((item) => item.id !== issueToDelete));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete record.",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setIssueToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIssueToDelete(null);
  };

  // Helper to determine if a record is overdue
  const checkIsOverdue = (status, dueDate) => {
    return status !== "returned" && dueDate && new Date(dueDate) < new Date();
  };

  // Filtered issues based on search and status tabs
  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      const studentName = item.student?.student_name?.toLowerCase() || "";
      const bookTitle = item.book?.title?.toLowerCase() || "";
      const studentIdStr = String(item.student_id || "").toLowerCase();
      const bookIdStr = String(item.book_id || "").toLowerCase();
      const query = search.toLowerCase();

      const matchesSearch =
        studentName.includes(query) ||
        bookTitle.includes(query) ||
        studentIdStr.includes(query) ||
        bookIdStr.includes(query);

      const isOverdue = checkIsOverdue(item.status, item.due_date);

      let matchesStatus = true;
      if (statusFilter === "returned") {
        matchesStatus = item.status === "returned";
      } else if (statusFilter === "overdue") {
        matchesStatus = isOverdue;
      } else if (statusFilter === "issued") {
        matchesStatus = item.status !== "returned" && !isOverdue;
      }

      return matchesSearch && matchesStatus;
    });
  }, [issues, search, statusFilter]);

  const getStatusBadge = (status, dueDate) => {
    const isOverdue = checkIsOverdue(status, dueDate);

    if (status === "returned") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
          <CheckCircle
            size={12}
            className="text-emerald-500 dark:text-emerald-400"
          />
          Returned
        </span>
      );
    }

    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
          <AlertCircle
            size={12}
            className="text-amber-500 dark:text-amber-400"
          />
          Overdue
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60">
        <Clock size={12} className="text-blue-500 dark:text-cyan-400" />
        Issued
      </span>
    );
  };

  return (
    <div className="w-full lg:min-w-160 mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Student Book Issue Management
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Track and manage borrowed library books and returns.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/library/bookissue/add")}
          className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98 cursor-pointer"
        >
          <Plus size={16} />
          <span>Issue New Book</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-lg border flex flex-col md:flex-row gap-3 transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or book title..."
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["all", "issued", "overdue", "returned"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
              title="Reset Filters"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border space-y-4 transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wider border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Book</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Return Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm divide-slate-100 dark:divide-slate-700/80">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500 dark:border-blue-400"></div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Loading issued books...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-slate-400 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen
                        size={32}
                        className="text-slate-300 dark:text-slate-600"
                      />
                      <span>No issued book records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700/40"
                  >
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                      {item.student?.student_name ||
                        `Student ID: ${item.student_id}`}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {item.book?.title || `Book ID: ${item.book_id}`}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.issue_date || "-"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.due_date || "-"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.return_date || "-"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status, item.due_date)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "returned" && (
                          <button
                            type="button"
                            onClick={() => handleReturn(item.id)}
                            className="text-xs border border-emerald-200 dark:border-emerald-900/60 rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100"
                            title="Mark as Returned"
                          >
                            Return
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-600 shadow-2xs"
                          title="Delete Record"
                        >
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

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3.5">
        {loading ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2.5 border-blue-600 dark:border-indigo-400"></div>
            <span className="text-sm">Loading issued books...</span>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <BookOpen
              size={32}
              className="mx-auto text-slate-400 dark:text-slate-600 mb-2"
            />
            <span className="text-sm font-medium">
              No issued book records found.
            </span>
          </div>
        ) : (
          filteredIssues.map((item) => (
            <div
              key={item.id}
              className="border rounded-2xl p-4 shadow-2xs flex flex-col gap-3 transition-colors bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base leading-snug truncate text-gray-900 dark:text-slate-100">
                    {item.book?.title || `Book ID: ${item.book_id}`}
                  </h3>
                  <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                    Student:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.student?.student_name || `ID: ${item.student_id}`}
                    </span>
                  </p>
                </div>
                <div>{getStatusBadge(item.status, item.due_date)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y text-xs border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                <div>
                  <span className="block text-[10px] uppercase opacity-75">
                    Issued
                  </span>
                  {item.issue_date || "-"}
                </div>
                <div>
                  <span className="block text-[10px] uppercase opacity-75">
                    Due
                  </span>
                  {item.due_date || "-"}
                </div>
                <div>
                  <span className="block text-[10px] uppercase opacity-75">
                    Returned
                  </span>
                  {item.return_date || "-"}
                </div>
              </div>

              <div className="flex items-center justify-end pt-1 gap-2">
                {item.status !== "returned" && (
                  <button
                    type="button"
                    onClick={() => handleReturn(item.id)}
                    className="border border-emerald-200 dark:border-emerald-900/60 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  >
                    Return
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteClick(item.id)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-600 shadow-2xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center my-auto border transition-all bg-white border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold">Delete Issue Record</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this issue record? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-rose-500/20 active:scale-95"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
