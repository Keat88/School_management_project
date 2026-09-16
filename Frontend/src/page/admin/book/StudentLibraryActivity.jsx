import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, UserCheck, Flame } from "lucide-react";
import { BookIssureApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

export default function StudentLibraryActivity() {
  const navigate = useNavigate();

  // Initialize dark mode state directly from localStorage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return document.documentElement.classList.contains("dark");
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

  return (
    <div className="lg:min-w-160 mx-auto font-sans transition-colors space-y-6  dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2.5">
            {/* <div className="p-2 transition duration-200 rounded-xl border bg-blue-600 text-white border-blue-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
              <Flame size={22} />
            </div> */}
            Student Library Activity & Top Visitors
          </h2>
          <p className="text-xs sm:text-sm mt-1 text-slate-500 dark:text-slate-400">
            Monitor student library engagement, visits, and book borrowing
            statistics.
          </p>
        </div>

       
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center p-4 rounded-xl border shadow-inner transition-colors bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800/80">
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 flex-1 w-full"
        >
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-700/80 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md  transition-all cursor-pointer active:scale-95"
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
            className="w-full md:w-auto px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-pointer transition-all bg-white border-slate-300 text-slate-800 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-700/80 dark:text-slate-200"
          >
            <option value="library_visits">Most Library Visits</option>
            <option value="total_borrowed">Most Books Borrowed</option>
            <option value="total_returned">Most Books Returned</option>
            <option value="student_name">Student Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-lg border shadow-inner overflow-hidden transition-colors bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 dark:shadow-slate-950/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead className="border-b text-xs font-bold uppercase tracking-wider transition-colors bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4 w-16">#N</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Total Borrowed</th>
                <th className="px-5 py-4">Total Returned</th>
                <th className="px-5 py-4">Library Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm divide-slate-200 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">
                        Loading statistics...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : studentStats.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserCheck
                        size={36}
                        className="text-slate-400 dark:text-slate-600"
                      />
                      <span className="text-sm">
                        No student activity records found.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                studentStats.map((student, index) => (
                  <tr
                    key={student.student_id || index}
                    className="transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-5 py-4 font-medium text-slate-500">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                      {currentPage === 1 &&
                      index === 0 &&
                      sortBy === "library_visits" ? (
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
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {student.total_borrowed} books
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {student.total_returned} books
                    </td>
                    <td className="px-5 py-4 font-bold text-indigo-600 dark:text-indigo-400">
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
