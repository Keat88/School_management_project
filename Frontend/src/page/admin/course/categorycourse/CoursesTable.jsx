import { useState, useEffect } from "react";
import { BookOpen, Edit, Trash2, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../../data/api";
import { Link } from "react-router-dom";

export default function CoursesTable({ isDark = false }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Fetch categories for filter dropdown
  useEffect(() => {
    api.get("/course-categories")
      .then((res) => {
        if (res.data.status === "success") {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Fetch courses with backend pagination and filters
  const fetchCourses = (page = 1) => {
    setLoading(true);
    let url = `/courses?page=${page}`;
    if (selectedCategory) url += `&category_id=${selectedCategory}`;
    if (selectedStatus) url += `&status=${selectedStatus}`;

    api.get(url)
      .then((res) => {
        if (res.data.status === "success") {
          setCourses(res.data.data.data);
          setPagination({
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage, selectedCategory, selectedStatus]);

  // Client-side search filtering on the current page dataset
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.status === "success") {
        fetchCourses(currentPage);
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: isDark ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/60" : "bg-emerald-50 text-emerald-700 border-emerald-100",
      draft: isDark ? "bg-amber-950/50 text-amber-400 border-amber-900/60" : "bg-amber-50 text-amber-700 border-amber-100",
      archived: isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={`space-y-6 lg:min-w-160 mx-auto p-6 rounded-2xl border shadow-xs ${
      isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            <BookOpen className="text-blue-600" size={22} />
            Courses Management
          </h2>
          <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Monitor and manage all created courses, pricing, and publication statuses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative">
            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-48 pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-blue-900 focus:border-blue-500" 
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600"
              }`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
              isDark 
                ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-blue-900 focus:border-blue-500" 
                : "bg-white border-slate-200 text-slate-900 focus:ring-blue-100 focus:border-blue-600"
            }`}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
              isDark 
                ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-blue-900 focus:border-blue-500" 
                : "bg-white border-slate-200 text-slate-900 focus:ring-blue-100 focus:border-blue-600"
            }`}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <Link to={'/admin/course/add'} className="bg-blue-600  text-sm hover:bg-blue-500 text-white rounded-xl border border-gray-50 px-1 py-2 duration-200 transition-transform ">
            +Add Category
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className={`border-b ${
              isDark ? "bg-slate-800/50 border-slate-800 text-slate-300" : "bg-gray-50 border-slate-200 text-slate-700"
            }`}>
              <th className="py-3 px-4 font-semibold">Course Title</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Instructor</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Level</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-200"}`}>
            {loading ? (
              <tr>
                <td colSpan="7" className={`py-8 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Loading courses...
                </td>
              </tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan="7" className={`py-8 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  No courses found.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr 
                  key={course.id} 
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className={`font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      {course.title}
                    </div>
                    <div className={`text-xs font-mono ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {course.slug}
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.category?.name || "—"}
                  </td>
                  <td className={`py-3 px-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.instructor?.name || "—"}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${course.price}
                    {course.discount_price && (
                      <span className={`block text-xs line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        ${course.discount_price}
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-4 capitalize text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {course.level || "—"}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button 
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isDark 
                          ? "border-slate-700 hover:bg-slate-800 text-slate-300" 
                          : "border-slate-200 hover:bg-slate-100 text-slate-600"
                      }`}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isDark 
                          ? "border-slate-700 hover:bg-slate-800 text-slate-300" 
                          : "border-slate-200 hover:bg-slate-100 text-slate-600"
                      }`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isDark 
                          ? "border-red-950 bg-red-950/20 hover:bg-red-950/40 text-red-400" 
                          : "border-red-100 bg-red-50 hover:bg-red-100 text-red-600"
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Showing page {pagination.current_page} of {pagination.last_page} (Total {pagination.total} courses)
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.last_page))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}