import { useState, useEffect } from "react";
import {
  BookOpen,
  Edit,
  Trash2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Layers,
  CheckCircle2,
  FileText,
  Filter,
  Image as ImageIcon,
  Trash,
} from "lucide-react";
import { api } from "../../../../data/api";
import { Link } from "react-router-dom";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  // Fetch categories for filter dropdown
  useEffect(() => {
    api
      .get("/course-categories")
      .then((res) => {
        if (res.data.status === "success" || res.data.status === true) {
          const catData = res.data.data;
          setCategories(Array.isArray(catData) ? catData : catData.data || []);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Fetch courses with backend pagination, filters, and search
  const fetchCourses = (page = 1, search = "") => {
    setLoading(true);
    let url = `/course/index?page=${page}`;
    if (selectedCategory) url += `&category_id=${selectedCategory}`;
    if (selectedStatus) url += `&status=${selectedStatus}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    api
      .get(url)
      .then((res) => {
        if (res.data.status === "success" || res.data.status === true) {
          const responseData = res.data.data;
          if (Array.isArray(responseData)) {
            setCourses(responseData);
            setPagination({
              current_page: 1,
              last_page: 1,
              total: responseData.length,
            });
          } else {
            setCourses(responseData.data || []);
            setPagination({
              current_page: responseData.current_page || 1,
              last_page: responseData.last_page || 1,
              total: responseData.total || 0,
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(currentPage, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, selectedCategory, selectedStatus, searchQuery]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await api.delete(`/course/destroy/${id}`);
      if (res.data.status === "success" || res.data.status === true) {
        fetchCourses(currentPage, searchQuery);
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      published:
        "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      draft:
        "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      archived:
        "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize tracking-wide ${styles[status] || styles.draft}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${status === "published" ? "bg-emerald-500" : status === "draft" ? "bg-amber-500" : "bg-slate-400"}`}
        />
        {status}
      </span>
    );
  };

  // Compute stats for the top summary cards
  const publishedCount = courses.filter((c) => c.status === "published").length;
  const draftCount = courses.filter((c) => c.status === "draft").length;

  return (
    <div className="space-y-6 lg:min-w-160 mx-auto  text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 border border-blue-100 dark:border-indigo-500/20">
              <BookOpen size={20} />
            </div>
            Courses Management
          </h2>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Monitor and manage all created courses, pricing structures, and
            publication statuses.
          </p>
        </div>
        <Link
          to="/admin/course/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-500 dark:bg-blue-500 text-sm hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 duration-200 font-medium  shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} /> Add New Course
        </Link>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 shadow-sm duration-200 transition-transform hover:-translate-y-0.5 dark:bg-slate-950/40 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-100/60 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Courses
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {pagination.total}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg shadow-sm duration-200 transition-transform hover:-translate-y-0.5 border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Published
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {publishedCount}
            </p>
          </div>
        </div>

        <div className="p-4 shadow-sm duration-200 transition-transform hover:-translate-y-0.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Drafts
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {draftCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by course title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white border-slate-200 text-slate-900 focus:ring-blue-100 focus:border-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white border-slate-200 text-slate-900 focus:ring-blue-100 focus:border-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50/80 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-300">
              <th className="py-3.5 px-4 font-semibold">Course Title</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Instructor</th>
              <th className="py-3.5 px-4 font-semibold">Price</th>
              <th className="py-3.5 px-4 font-semibold">Level</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-16 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex justify-center items-center gap-2.5">
                    <Loader2
                      className="animate-spin text-blue-600 dark:text-indigo-400"
                      size={22}
                    />
                    <span className="text-sm font-medium">
                      Loading courses...
                    </span>
                  </div>
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-16 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <BookOpen
                      size={36}
                      className="text-slate-300 dark:text-slate-700"
                    />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      No courses found matching your criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <ImageIcon size={16} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {course.title}
                        </div>
                        <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                          /{course.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.category?.name || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-xs font-medium">
                    {course.instructor?.name || "—"}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    ${course.price}
                    {course.discount_price && (
                      <span className="block text-[11px] font-normal line-through text-slate-400 dark:text-slate-500">
                        ${course.discount_price}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 capitalize text-xs font-medium text-slate-600 dark:text-slate-300">
                    {course.level || "—"}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(course.status)}</td>
                  <td className="py-4 px-4 text-right space-x-1.5">
                    <Link
                      to={`/admin/course/view/${course.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={16}/>
                      View
                    </Link>
                    <Link
                      to={`/admin/course/add/${course.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-md text-xs font-medium hover:bg-gray-700 transition-colors shadow-xs dark:bg-slate-700 dark:hover:bg-slate-600"
                      title="Edit Course"
                    >
                      <Edit size={16}/>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                      title="Delete Course"
                    ><Trash size={16}/>
                      Delete
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
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing page{" "}
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              {pagination.current_page}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              {pagination.last_page}
            </span>{" "}
            ({pagination.total} total courses)
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 shadow-xs"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.last_page),
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 shadow-xs"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
