import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Building2, Home, Users } from "lucide-react";
import { hostelRoomApi } from "../../../data/Hostel";
import Pagination from "../../../hooks/Pagination";
import { colorbtn } from "../../../data/datafeature";

export default function ManageHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 10;

  // Real-time stat counts from fetched list
  const maleDorms = hostels.filter(
    (h) => h.type?.toLowerCase() === "male",
  ).length;
  const femaleDorms = hostels.filter(
    (h) => h.type?.toLowerCase() === "female",
  ).length;
  const otherDorms = hostels.filter(
    (h) => !["male", "female"].includes(h.type?.toLowerCase()),
  ).length;

  const fetchHostels = useCallback(
    async (page = 1, searchQuery = "", typeQuery = "") => {
      setLoading(true);
      try {
        const params = { page, per_page: perPage };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (typeQuery && typeQuery !== "All") params.type = typeQuery;

        const response = await hostelRoomApi.getAll({ params });
        const result = response.data?.data || response.data || [];
        const meta = response.data?.meta || response.data;

        setHostels(Array.isArray(result) ? result : []);

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
    },
    [],
  );

  useEffect(() => {
    fetchHostels(currentPage, search, selectedType);
  }, [currentPage, fetchHostels, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchHostels(1, search, selectedType);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this building?"))
      return;
    try {
      await hostelRoomApi.delete(id);
      setFeedback({ type: "success", text: "Building deleted successfully!" });
      fetchHostels(currentPage, search, selectedType);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete building.",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans text-slate-800 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dormitory Buildings Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage campus dormitory buildings, categories, and locations.
          </p>
        </div>
        <Link
          to="/admin/hostels/add"
          className={colorbtn.btnadd}
        >
          <Plus size={16} />
          <span>Add Building</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Buildings
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalItems}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Male Dorms
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {maleDorms}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Female Dorms
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {femaleDorms}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Home size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Other Dorms
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {otherDorms}
            </h3>
          </div>
        </div>
      </div>

      {/* Feedback Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${feedback.type === "success" ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20" : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20"}`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search & Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search building name or address..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 dark:text-slate-100"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        >
          <option value="All">All Types</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </form>

      {/* Table Container */}
      <div className="bg-white rounded-lg dark:bg-slate-900 rounded-lg overflow-hidden relative border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs z-10 flex flex-col items-center justify-center">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              Loading buildings...
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-800 text-white text-xs font-semibold tracking-wider">
                <th className="px-5 py-3.5 w-20">#N</th>
                <th className="px-5 py-3.5">Building</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Address</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {hostels.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No buildings found.
                  </td>
                </tr>
              ) : (
                hostels.map((hostel, index) => (
                  <tr
                    key={hostel.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                      {hostel.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                        {hostel.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {hostel.address}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/hostels/edit/${hostel.id}`}
                          className={colorbtn.btnedit}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(hostel.id)}
                          className={colorbtn.delete}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
