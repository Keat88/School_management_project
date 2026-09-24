import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, RotateCcw, AlertTriangle } from "lucide-react";
import { BookCategoryApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";
import { colorbtn } from "../../../data/datafeature";

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async (page = 1, searchTerm = search) => {
    setLoading(true);
    try {
      const res = await BookCategoryApi.getAll({
        search: searchTerm,
        page: page,
      });

      const rawData = res?.data || res;
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

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
    setFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await BookCategoryApi.delete(categoryToDelete);
      setFeedback({ type: "success", text: "Category deleted successfully!" });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories(currentPage, search);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete category.",
      });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="w-full lg:min-w-160 mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Manage Book Categories
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Browse, search, and manage library categories.
          </p>
        </div>
        <NavLink
          to="/admin/library/category/add"
          className={colorbtn.btnadd}
        >
          <Plus size={16} />
          <span>Add Category</span>
        </NavLink>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Search & Filter Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-4 rounded-lg border flex flex-col md:flex-row gap-3 transition-colors  bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-900 dark:text-slate-100"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors bg-slate-50/50 border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer shadow-xs active:scale-98"
          >
            Search
          </button>
        </div>
      </form>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border space-y-4 transition-colors bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b text-xs font-semibold uppercase tracking-wider border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm divide-slate-100 dark:divide-slate-700/80">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="py-12 text-center text-slate-400 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500 dark:border-blue-400"></div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Loading categories...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="py-12 text-center text-slate-400 dark:text-slate-400"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-700/40"
                  >
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap text-slate-800 dark:text-slate-200">
                      {cat.book_category}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {cat.created_at
                        ? new Date(cat.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/library/category/view/${cat.id}`)
                          }
                          className={colorbtn.btnview}
                          title="View"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/library/category/add/${cat.id}`)
                          }
                          className={colorbtn.btnedit}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cat.id)}
                          className={colorbtn.btndelete}
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

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3.5">
        {loading ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2.5 border-blue-600 dark:border-indigo-400"></div>
            <span className="text-sm">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <span className="text-sm font-medium">No categories found.</span>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-2xl p-4 shadow-2xs flex flex-col gap-3 transition-colors bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base leading-snug truncate text-gray-900 dark:text-slate-100">
                    {cat.book_category}
                  </h3>
                  <p className="text-xs mt-1 text-gray-500 dark:text-slate-400 font-mono">
                    Created: {cat.created_at ? new Date(cat.created_at).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t text-xs gap-2 border-gray-100 dark:border-slate-800/80">
                <button
                  onClick={() => navigate(`/admin/library/category/view/${cat.id}`)}
                  className="border border-gray-200 dark:border-slate-700 rounded-md px-2.5 py-1.5 font-medium transition-colors cursor-pointer bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/admin/library/category/add/${cat.id}`)}
                  className="px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-700 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 border border-slate-600 dark:border-slate-600 shadow-2xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(cat.id)}
                  className="px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-600 dark:border-rose-600 shadow-2xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="pt-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center my-auto border transition-all bg-white border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-2">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold">Delete Category</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-rose-500/20 active:scale-95"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}