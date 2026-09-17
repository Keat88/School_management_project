import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { BookCategoryApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

export default function ManageCategories() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return document.documentElement.classList.contains("dark");
  });

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchCategories = async (page = 1, searchTerm = search) => {
    setLoading(true);
    try {
      const res = await BookCategoryApi.getAll({
        search: searchTerm,
        page: page,
      });

      // Extract paginated array and pagination metadata
      const rawData = res?.data || res;

      // Check if data is wrapped inside Laravel response format
      const items = rawData?.data || (Array.isArray(rawData) ? rawData : []);
      const lastPage = rawData?.meta?.last_page || rawData?.last_page || 1;
      const activePage =
        rawData?.meta?.current_page || rawData?.current_page || page;

      setCategories(items);
      setTotalPages(lastPage);
      setCurrentPage(activePage);
    } catch (error) {
      setCategories([]);
      setTotalPages(1);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to load categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, search);
  }, [currentPage]);

  const handleReset = (e) => {
    e.preventDefault();
    setSearch("");
    setCurrentPage(1);
    fetchCategories(1, "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories(1, search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await BookCategoryApi.delete(id);
      setFeedback({ type: "success", text: "Category deleted successfully!" });
      fetchCategories(currentPage, search);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete category.",
      });
    }
  };

  return (
    <div
      className={`${isDark ? "dark" : ""} w-full lg:min-w-160 mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors duration-200`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-50">
            Manage Book Categories
          </h2>
          <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-slate-400">
            Browse, search, and manage library categories
          </p>
        </div>
        <NavLink
          to="/admin/library/category/add"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-sm duration-150 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </NavLink>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/60"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search & Filter Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row gap-2.5 p-4 rounded-xl border transition-colors bg-gray-50/80 border-gray-200/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-xs"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Table Container */}
      <div className="rounded-xl border overflow-hidden transition-colors bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-xs font-semibold uppercase tracking-wider bg-gray-50/90 border-gray-200 text-gray-600 dark:bg-slate-800/80 dark:border-slate-800 dark:text-slate-300">
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Created At</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm divide-gray-100 text-gray-700 dark:divide-slate-800 dark:text-slate-300">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-12 text-center text-gray-400 dark:text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
                    <span>Loading categories...</span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-12 text-center text-gray-400 dark:text-slate-400"
                >
                  <span>No categories found.</span>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="transition-colors hover:bg-gray-50/60 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-slate-100">
                    {cat.book_category}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 dark:text-slate-400 font-mono">
                    {cat.created_at
                      ? new Date(cat.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() =>
                        navigate(`/admin/library/category/view/${cat.id}`)
                      }
                      className="text-md border rounded-lg px-2.5 py-1 transition-colors font-medium active:scale-95 cursor-pointer bg-green-600 text-white border-green-600 hover:bg-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-500 shadow-xs"
                      title="View"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/library/category/add/${cat.id}`)
                      }
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-600 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 border border-slate-600 dark:border-slate-700 shadow-2xs"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 border border-red-600 dark:border-red-600 shadow-xs"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
