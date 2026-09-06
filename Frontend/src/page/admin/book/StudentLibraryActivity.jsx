import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, UserCheck, Flame } from "lucide-react";
import { BookIssureApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

export default function StudentLibraryActivity() {
  const navigate = useNavigate();
  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("library_visits"); // Default to top visitors

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchStudentStats = async (page = 1, currentSort = sortBy) => {
    setLoading(true);
    try {
      const response = await BookIssureApi.getStudentStats({
        search: search || undefined,
        sort_by: currentSort,
        sort_order: "desc",
        page: page,
        per_page: perPage,
      });

      const responseData = response.data?.data || response.data;

      if (Array.isArray(responseData)) {
        setStudentStats(responseData);
        setTotalPages(1);
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        setStudentStats(responseData.data);
        setCurrentPage(responseData.current_page || 1);
        setTotalPages(responseData.last_page || 1);
      } else {
        setStudentStats([]);
      }
    } catch (error) {
      console.log("Error fetching student stats:", error);
      setStudentStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentStats(1, sortBy);
  }, [sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudentStats(1, sortBy);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudentStats(page, sortBy);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Flame className="text-orange-500" size={22} />
          Student Library Activity & Top Visitors
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 flex-1 w-full"
        >
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <Filter size={14} />
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="library_visits">Most Library Visits</option>
            <option value="total_borrowed">Most Books Borrowed</option>
            <option value="total_returned">Most Books Returned</option>
            <option value="student_name">Student Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3 w-16">#N</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Total Borrowed</th>
              <th className="px-4 py-3">Total Returned</th>
              <th className="px-4 py-3">Library Visits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading statistics...</span>
                  </div>
                </td>
              </tr>
            ) : studentStats.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No student activity records found.
                </td>
              </tr>
            ) : (
              studentStats.map((student, index) => (
                <tr
                  key={student.student_id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-500">
                    {(currentPage - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                    {currentPage === 1 &&
                    index === 0 &&
                    sortBy === "library_visits" ? (
                      <Flame size={16} className="text-orange-500" />
                    ) : (
                      <UserCheck size={16} className="text-blue-500" />
                    )}
                    {student.student_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.total_borrowed} books
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.total_returned} books
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {student.library_visits} visits
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}