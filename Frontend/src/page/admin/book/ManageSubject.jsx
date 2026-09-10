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

export default function ManageSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Manage Subjects</h2>
        <Link
          to="/admin/subjects/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Subject
        </Link>
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

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-4 rounded-xl border border-gray-200 flex gap-3 shadow-md"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name or code..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleResetSearch}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Subject List Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>

                <td colSpan="6" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading cagetegory...</span>
                  </div>
                </td>
              </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sub.image_url || sub.image ? (
                        <img
                          src={sub.image_url || sub.image}
                          alt={sub.subject_name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {sub.subject_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-medium">
                        {sub.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/subjects/add/${sub.id}`}
                          className="p-1 text-blue-500 border border-gray-200 rounded-md duration-200 hover:bg-gray-200 transition-colors"
                          title="Edit"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id)}
                          className="p-1 text-red-500 border bg-red-50 border-gray-200 rounded-md duration-200 hover:bg-red-100 transition-colors"
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
        onPageChange={handlePageChange}
      />
    </div>
  );
}
