import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, UserCheck, Flame, Trophy, Award, Medal } from "lucide-react";
import { BookIssureApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

export default function StudentLibraryActivity({ isDark: propIsDark = true }) {
  const navigate = useNavigate();

  // Initialize dark mode state directly from localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
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
      const savedTheme =
        localStorage.getItem("theme") || localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark" || savedTheme === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchStudentStats = useCallback(
    async (page, searchQuery, currentSort) => {
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
    },
    [perPage],
  );

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

  const getRankBadge = (index) => {
    const absoluteRank = (currentPage - 1) * perPage + index + 1;
    if (absoluteRank === 1 && sortBy === "library_visits") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60 shadow-2xs">
          <Trophy size={13} className="text-amber-500" />
          #1 Top Visitor
        </span>
      );
    }
    if (absoluteRank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
          <Trophy size={12} className="text-amber-500" />
          #1
        </span>
      );
    }
    if (absoluteRank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <Award size={12} className="text-slate-400" />
          #2
        </span>
      );
    }
    if (absoluteRank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60">
          <Medal size={12} className="text-orange-500" />
          #3
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">
        #{absoluteRank}
      </span>
    );
  };

  return (
    <div className="w-full lg:min-w-160 mx-auto font-sans transition-colors space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
            Student Library Activity & Top Visitors
          </h2>
          <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400">
            Monitor student library engagement, visits, and book borrowing statistics.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center p-4 rounded-lg border shadow-2xs transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all bg-slate-50/50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Filter size={14} />
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-slate-600 dark:text-slate-400">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer transition-all bg-slate-50/50 border-slate-200 text-slate-800 focus:border-blue-500 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200"
          >
            <option value="library_visits">Most Library Visits</option>
            <option value="total_borrowed">Most Books Borrowed</option>
            <option value="total_returned">Most Books Returned</option>
            <option value="student_name">Student Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b text-xs font-bold uppercase tracking-wider transition-colors bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-400">
                <th className="px-5 py-3.5 w-20">Rank</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Total Borrowed</th>
                <th className="px-5 py-3.5">Total Returned</th>
                <th className="px-5 py-3.5">Library Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm divide-slate-100 dark:divide-slate-700/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Loading statistics...</span>
                    </div>
                  </td>
                </tr>
              ) : studentStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserCheck size={36} className="text-slate-300 dark:text-slate-600" />
                      <span className="text-sm">No student activity records found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                studentStats.map((student, index) => (
                  <tr
                    key={student.student_id || index}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700/40"
                  >
                    <td className="px-5 py-3.5">{getRankBadge(index)}</td>
                    <td className="px-5 py-3.5 font-semibold flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                      {currentPage === 1 && index === 0 && sortBy === "library_visits" ? (
                        <div className="p-1 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 dark:border dark:border-orange-500/30">
                          <Flame size={14} />
                        </div>
                      ) : (
                        <div className="p-1 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border dark:border-indigo-500/30">
                          <UserCheck size={14} />
                        </div>
                      )}
                      {student.student_name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {student.total_borrowed} books
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {student.total_returned} books
                    </td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-cyan-400">
                      {student.library_visits} visits
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
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-400 shadow-2xs">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2.5 border-blue-600 dark:border-indigo-400"></div>
            <span className="text-sm">Loading statistics...</span>
          </div>
        ) : studentStats.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-400 shadow-2xs">
            <UserCheck size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <span className="text-sm font-medium">No student activity records found.</span>
          </div>
        ) : (
          studentStats.map((student, index) => (
            <div
              key={student.student_id || index}
              className="border rounded-2xl p-4 shadow-2xs flex flex-col gap-3 transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shrink-0">
                    <UserCheck size={16} />
                  </div>
                  <h3 className="font-semibold text-base truncate text-slate-900 dark:text-slate-100">
                    {student.student_name}
                  </h3>
                </div>
                <div>{getRankBadge(index)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2.5 border-y text-xs border-slate-100 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 text-center">
                <div className="bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg">
                  <span className="block text-[10px] uppercase opacity-75 mb-0.5">Borrowed</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.total_borrowed}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg">
                  <span className="block text-[10px] uppercase opacity-75 mb-0.5">Returned</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{student.total_returned}</span>
                </div>
                <div className="bg-blue-50 dark:bg-cyan-950/40 p-2 rounded-lg text-blue-700 dark:text-cyan-300">
                  <span className="block text-[10px] uppercase opacity-75 mb-0.5">Visits</span>
                  <span className="font-bold">{student.library_visits}</span>
                </div>
              </div>
            </div>
          ))
        )}
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