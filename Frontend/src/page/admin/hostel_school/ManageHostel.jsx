import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, Search, Building2, RotateCcw } from "lucide-react";
import { hostelRoomApi } from "../../../data/Hostel";
import Pagination from "../../../hooks/Pagination";

export default function ManageHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  const fetchHostels = useCallback(async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      // Clean query parameters before passing to Axios
      const params = {
        page,
        per_page: perPage,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Pass query parameters inside the `params` property
      const response = await hostelRoomApi.getAll({ params });

      const result = response.data?.data || response.data || [];
      const meta = response.data?.meta || response.data;

      setHostels(Array.isArray(result) ? result : []);

      // Extract pagination details safely
      if (meta && typeof meta === "object" && meta.current_page) {
        setCurrentPage(meta.current_page || page);
        setTotalPages(meta.last_page || 1);
        setTotalItems(meta.total || result.length || 0);
      } else {
        setCurrentPage(page);
        setTotalPages(1);
        setTotalItems(result.length || 0);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHostels([]);
        setTotalPages(1);
        setTotalItems(0);
      } else {
        console.error("Error fetching hostels:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels(currentPage, search);
  }, [currentPage, fetchHostels]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchHostels(1, search);
  };

  const handleResetSearch = () => {
    setSearch("");
    setCurrentPage(1);
    fetchHostels(1, "");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      await hostelRoomApi.delete(id);
      setFeedback({ type: "success", text: "Hostel deleted successfully!" });
      fetchHostels(currentPage, search);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete hostel.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Manage Hostels
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            View and handle hostel buildings and details
          </p>
        </div>
        <Link
          to="/admin/hostels/add"
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Plus size={16} />
          <span>Add Hostel</span>
        </Link>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hostel name, type or address..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={handleResetSearch}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Hostel Table with Loading Overlay */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center transition-all">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-gray-600 mt-2">
              Loading hostels...
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Hostel Name</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Address</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {!loading && hostels.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No hostels found.
                  </td>
                </tr>
              ) : (
                hostels.map((hostel) => (
                  <tr
                    key={hostel.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 size={16} />
                        </div>
                        <span>{hostel.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
                        {hostel.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {hostel.address}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/hostels/edit/${hostel.id}`}
                          className="p-1.5 text-blue-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(hostel.id)}
                          className="p-1.5 text-red-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
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
        perPage={perPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
