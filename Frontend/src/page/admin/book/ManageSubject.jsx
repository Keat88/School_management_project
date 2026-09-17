import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { subjectApi } from "../../../data/classrooms";
import Pagination from "../../../hooks/Pagination";

export default function ManageSubject({ isDark: propIsDark = false }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Sync with localStorage changes across components/tabs if theme toggles elsewhere
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

  const fetchSubjects = useCallback(async (page, searchQuery) => {
    setLoading(true);
    try {
      const response = await subjectApi.getAll({
        per_page: 10,
        page: page,
        search: searchQuery || undefined,
      });

      const outerData = response?.data || response;
      const paginatedPayload = outerData?.data || outerData;

      const items = Array.isArray(paginatedPayload)
        ? paginatedPayload
        : paginatedPayload?.data || [];

      const meta = paginatedPayload?.meta || outerData?.meta || {};

      setSubjects(items);
      setTotalPages(meta?.last_page || 1);
      setTotalItems(meta?.total || 0);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects(currentPage, activeSearch);
  }, [currentPage, activeSearch, fetchSubjects]);

  // Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search);
    setCurrentPage(1);
  };

  // Reset Search
  const handleResetSearch = () => {
    setSearch("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  // Change Page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    try {
      await subjectApi.delete(id);
      setFeedback({ type: "success", text: "Subject deleted successfully!" });
      fetchSubjects(currentPage, activeSearch);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete subject.",
      });
    }
  };

  return (
    <div
      className={`space-y-6 w-full lg:min-w-160 mx-auto  transition-colors ${
        isDark ? "text-slate-100" : "text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2
            className={`text-lg font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            Manage Subjects
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Configure and manage school subjects and course codes.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20">
            {totalItems} subjects found
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            feedback.type === "success"
              ? isDark
                ? "bg-green-950/40 text-green-400 border-green-900/60"
                : "bg-green-50 text-green-600 border-green-200"
              : isDark
                ? "bg-red-950/40 text-red-400 border-red-900/60"
                : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search Bar & Actions */}
      <form
        onSubmit={handleSearchSubmit}
        className={`p-4 rounded-lg border flex flex-col md:flex-row gap-3 transition-colors ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="relative flex-1">
          <span
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          >
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name or code..."
            className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetSearch}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
          >
            Search
          </button>
          <Link
            to="/admin/subjects/add"
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus size={16} />
            Add Subject
          </Link>
        </div>
      </form>

      {/* Subject List Table Container */}
      <div
        className={`border rounded-lg p-3 sm:p-5 space-y-4 transition-colors shadow-xs ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr
                className={`border-b text-xs font-semibold uppercase tracking-wider ${
                  isDark
                    ? "border-slate-800 bg-slate-800/60 text-slate-400"
                    : "border-gray-200 bg-gray-50/70 text-gray-500"
                }`}
              >
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-sm ${
                isDark ? "divide-slate-800" : "divide-gray-100"
              }`}
            >
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className={`py-12 text-center ${
                      isDark ? "text-slate-400" : "text-gray-400"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div
                        className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
                          isDark ? "border-indigo-400" : "border-indigo-300"
                        }`}
                      ></div>
                      <span
                        className={isDark ? "text-slate-400" : "text-gray-500"}
                      >
                        Loading subjects...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`px-4 py-10 text-center ${
                      isDark ? "text-slate-400" : "text-gray-400"
                    }`}
                  >
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sub.image_url || sub.image ? (
                        <img
                          src={sub.image_url || sub.image}
                          alt={sub.subject_name}
                          className={`w-10 h-10 rounded-lg object-cover border ${
                            isDark ? "border-slate-700" : "border-gray-200"
                          }`}
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-slate-500"
                              : "bg-gray-100 border-gray-200 text-gray-400"
                          }`}
                        >
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium whitespace-nowrap ${
                        isDark ? "text-slate-200" : "text-gray-800"
                      }`}
                    >
                      {sub.subject_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-medium border ${
                          isDark
                            ? "bg-slate-800 border-slate-700 text-slate-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      >
                        {sub.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/subjects/add/${sub.id}`}
                          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-600 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 border border-slate-600 dark:border-slate-700 shadow-xs"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id)}
                          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-600 shadow-xs"
                          title="Delete"
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

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={10}
        onPageChange={handlePageChange}
        isDark={isDark}
      />
    </div>
  );
}
