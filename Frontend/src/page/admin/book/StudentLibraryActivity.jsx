import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, UserCheck, Flame, Sun, Moon } from "lucide-react";
import { BookIssureApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

export default function StudentLibraryActivity({ isDark: propIsDark = true }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortBy, setSortBy] = useState("library_visits");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

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

  const fetchStudentStats = useCallback(async (page, searchQuery, currentSort) => {
    setLoading(true);
    try {
      const response = await BookIssureApi.getStudentStats({
        search: searchQuery || undefined,
        sort_by: currentSort,
        sort_order: "desc",
        page: page,
        per_page: perPage,
      });

      const responseData = response?.data?.data || response?.data;

      if (Array.isArray(responseData)) {
        setStudentStats(responseData);
        setTotalPages(1);
        setTotalItems(responseData.length);
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        setStudentStats(responseData.data);
        setCurrentPage(responseData.current_page || page);
        setTotalPages(responseData.last_page || 1);
        setTotalItems(responseData.total || responseData.data.length);
      } else {
        setStudentStats([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching student stats:", error);
      setStudentStats([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    fetchStudentStats(currentPage, activeSearch, sortBy);
  }, [currentPage, activeSearch, sortBy, fetchStudentStats]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div
      className={`lg:min-w-160 mx-auto rounded-lg p-6 sm:p-8  font-sans my-8 transition-colors space-y-6 ${
        isDark
          ? "bg-slate-900 border border-slate-800 text-slate-100"
          : "bg-white border border-slate-200 text-slate-900"
      }`}
    >
      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <div>
          <h2 className={`text-2xl font-extrabold tracking-tight flex items-center gap-2.5 ${isDark ? "text-white" : "text-slate-900"}`}>
            <div className={`p-2 rounded-xl border ${isDark ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-orange-100 border-orange-200 text-orange-600"}`}>
              <Flame size={22} />
            </div>
            Student Library Activity & Top Visitors
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Monitor student library engagement, visits, and book borrowing statistics.
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
            onClick={() => navigate(-1)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-sm active:scale-95 ${
              isDark
                ? "bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`flex flex-col md:flex-row gap-3 justify-between items-center p-4 rounded-2xl border shadow-inner ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 flex-1 w-full"
        >
          <div className="relative flex-1">
            <span className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all ${
                isDark
                  ? "bg-slate-900 border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-indigo-500"
                  : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500"
              }`}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Filter size={14} />
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full md:w-auto px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer transition-all ${
              isDark
                ? "bg-slate-900 border-slate-700/80 text-slate-200 focus:border-indigo-500"
                : "bg-white border-slate-300 text-slate-800 focus:border-indigo-500"
            }`}
          >
            <option value="library_visits">Most Library Visits</option>
            <option value="total_borrowed">Most Books Borrowed</option>
            <option value="total_returned">Most Books Returned</option>
            <option value="student_name">Student Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className={`rounded-2xl border shadow-inner overflow-hidden ${isDark ? "bg-slate-950/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${isDark ? "bg-slate-900/80 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                <th className="px-5 py-4 w-16">#N</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Total Borrowed</th>
                <th className="px-5 py-4">Total Returned</th>
                <th className="px-5 py-4">Library Visits</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${isDark ? "divide-slate-800/60" : "divide-slate-200"}`}>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-16 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading statistics...</span>
                    </div>
                  </td>
                </tr>
              ) : studentStats.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserCheck size={36} className={isDark ? "text-slate-600" : "text-slate-400"} />
                      <span className="text-sm">No student activity records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                studentStats.map((student, index) => (
                  <tr
                    key={student.student_id || index}
                    className={`transition-colors ${isDark ? "hover:bg-slate-900/60" : "hover:bg-slate-50/80"}`}
                  >
                    <td className={`px-5 py-4 font-medium ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className={`px-5 py-4 font-semibold flex items-center gap-2.5 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {currentPage === 1 &&
                      index === 0 &&
                      sortBy === "library_visits" ? (
                        <div className={`p-1 rounded-lg ${isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                          <Flame size={14} />
                        </div>
                      ) : (
                        <div className={`p-1 rounded-lg ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                          <UserCheck size={14} />
                        </div>
                      )}
                      {student.student_name}
                    </td>
                    <td className={`px-5 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {student.total_borrowed} books
                    </td>
                    <td className={`px-5 py-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {student.total_returned} books
                    </td>
                    <td className={`px-5 py-4 font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                      {student.library_visits} visits
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
        isDark={isDark}
      />
    </div>
  );
}