import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, RotateCcw, BookOpen, AlertTriangle, CheckCircle2, AlertCircle, X } from "lucide-react";
import { BookApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";
import { colorbtn } from "../../../data/datafeature";

export default function ManageBooks({ isDark: propIsDark = false }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Sync with localStorage changes across components/tabs if theme toggles elsewhere
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

  const fetchBooks = async (page = 1, currentFilters = {}) => {
    setLoading(true);
    try {
      const activeFilters = {
        page,
        search: currentFilters.search ?? search,
        isbn: currentFilters.isbn ?? isbn,
        category: currentFilters.category ?? category,
      };

      const res = await BookApi.getAll(activeFilters);
      const rawData = res?.data || res;

      // Unpack Laravel paginated response structure
      const items = rawData?.data || (Array.isArray(rawData) ? rawData : []);
      const lastPage = rawData?.meta?.last_page || rawData?.last_page || 1;
      const activePage = rawData?.meta?.current_page || rawData?.current_page || page;

      setBooks(items);
      setTotalPages(lastPage);
      setCurrentPage(activePage);
    } catch (error) {
      setBooks([]);
      setTotalPages(1);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to load books.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(1, { search, isbn, category });
  };

  const handleReset = () => {
    setSearch("");
    setIsbn("");
    setCategory("");
    setCurrentPage(1);
    fetchBooks(1, { search: "", isbn: "", category: "" });
  };

  const handleDeleteClick = (id) => {
    setBookToDelete(id);
    setIsDeleteModalOpen(true);
    setFeedback(null);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await BookApi.delete(bookToDelete);
      setFeedback({ type: "success", text: "Book deleted successfully!" });
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks(currentPage, { search, isbn, category });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete book.",
      });
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  };

  // Computed Quick Stats from current page items
  const totalLoaded = books.length;
  const lowStockCount = books.filter((b) => b.available_copies <= 2 && b.available_copies > 0).length;
  const outOfStockCount = books.filter((b) => b.available_copies === 0).length;

  const renderStockBadge = (available, total) => {
    if (available === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold  text-red-700 dark:text-red-400 ">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Out of Stock ({available}/{total})
        </span>
      );
    }
    if (available <= 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold  text-amber-700   dark:text-amber-400 ">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Low Stock ({available}/{total})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {available} / {total} Available
      </span>
    );
  };

  return (
    <div className={`${isDark ? "dark" : ""} w-full lg:min-w-160 mx-auto space-y-6 text-gray-900 dark:text-slate-100 transition-colors duration-200`}>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
            Manage Books
          </h2>
          <p className="text-xs sm:text-sm mt-1 text-gray-500 dark:text-slate-400">
            Browse, search, filter, and modify library catalog items efficiently.
          </p>
        </div>
        <NavLink
          to="/admin/library/book/add"
          className={colorbtn.btnadd}
        >
          <Plus size={16} />
          <span>Add New Book</span>
        </NavLink>
      </div>

      {/* Quick Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border bg-white border-gray-200/80 dark:bg-slate-900 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Loaded on Page</p>
            <p className="text-base font-bold text-gray-800 dark:text-slate-100">{totalLoaded} Books</p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border bg-white border-gray-200/80 dark:bg-slate-900 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Low Stock Alert</p>
            <p className="text-base font-bold text-amber-600 dark:text-amber-400">{lowStockCount} Items</p>
          </div>
        </div>
        <div className="p-3.5 rounded-xl border bg-white border-gray-200/80 dark:bg-slate-900 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Out of Stock</p>
            <p className="text-base font-bold text-red-600 dark:text-red-400">{outOfStockCount} Items</p>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Responsive Filter/Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg border transition-colors bg-gray-50/70 border-gray-200/80 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-gray-400 dark:text-slate-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author..."
            className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 shadow-2xs"
          />
        </div>

        <div>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Filter by ISBN..."
            className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 shadow-2xs"
          />
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filter by category..."
            className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 shadow-2xs"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
          >
            <Filter size={15} />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-gray-200/80 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 shadow-2xs"
            title="Reset Filters"
          >
            <RotateCcw size={15} />
            <span className="sr-only md:not-sr-only">Reset</span>
          </button>
        </div>
      </form>

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block rounded-lg border overflow-hidden transition-colors bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-xs font-semibold uppercase tracking-wider bg-gray-50/70 border-gray-100 text-gray-500 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400">
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Title & Author</th>
              <th className="py-3.5 px-4">ISBN</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Availability</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm divide-gray-100 text-gray-700 dark:divide-slate-800/80 dark:text-slate-300">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-gray-400 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-indigo-400"></div>
                    <span className="text-sm font-medium">Loading books catalog...</span>
                  </div>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-gray-400 dark:text-slate-400">
                  <BookOpen className="mx-auto mb-2 opacity-40 text-blue-500" size={36} />
                  <p className="font-semibold text-gray-600 dark:text-slate-300">No books found</p>
                  <p className="text-xs mt-1 text-gray-400">Try adjusting your search criteria or filters.</p>
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-slate-800/40 group"
                >
                  <td className="py-3.5 px-4">
                    {book.book_image ? (
                      <img
                        src={book.book_image}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded-lg border shadow-2xs border-gray-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-10 h-14 rounded-lg border flex items-center justify-center text-[10px] font-medium text-center px-1 bg-gray-100 border-gray-200 text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                        No Cover
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold truncate text-gray-900 dark:text-slate-100">
                      {book.title}
                    </p>
                    <p className="text-xs truncate text-gray-500 dark:text-slate-400 mt-0.5">
                      {book.author}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-600 dark:text-slate-400">
                    {book.isbn || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium border bg-gray-100/80 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {book.category?.book_category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {renderStockBadge(book.available_copies, book.total_copies)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/library/book/add/${book.id}`)}
                      className={colorbtn.btnedit}
                      title="Update Book"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book.id)}
                      className={colorbtn.btndelete}
                      title="Delete Book"
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

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3.5">
        {loading ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2.5 border-blue-600 dark:border-indigo-400"></div>
            <span className="text-sm">Loading books...</span>
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border p-6 bg-white border-gray-200 text-gray-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 shadow-xs">
            <BookOpen className="mx-auto mb-2 opacity-50 text-blue-500" size={36} />
            <span className="text-sm font-medium">No books found matching criteria.</span>
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="border rounded-2xl p-4 shadow-2xs flex flex-col gap-3 transition-colors bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
            >
              <div className="flex gap-3.5">
                {book.book_image ? (
                  <img
                    src={book.book_image}
                    alt={book.title}
                    className="w-14 h-20 object-cover rounded-xl border shrink-0 border-gray-200 dark:border-slate-700 shadow-2xs"
                  />
                ) : (
                  <div className="w-14 h-20 rounded-xl border flex items-center justify-center text-[10px] font-medium text-center shrink-0 p-1 bg-gray-100 border-gray-200 text-gray-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                    No Cover
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base leading-snug truncate text-gray-900 dark:text-slate-100">
                    {book.title}
                  </h3>
                  <p className="text-xs mt-0.5 text-gray-500 dark:text-slate-400">{book.author}</p>

                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium border bg-gray-100 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {book.category?.book_category || "Uncategorized"}
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 dark:text-slate-400">
                      ISBN: {book.isbn || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t text-xs border-gray-100 dark:border-slate-800/80">
                <div>
                  {renderStockBadge(book.available_copies, book.total_copies)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/library/book/add/${book.id}`)}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-slate-700 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 border border-slate-600 dark:border-slate-600 shadow-2xs"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteClick(book.id)}
                    className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer bg-red-500 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-600 dark:border-rose-600 shadow-2xs"
                  >
                    Delete
                  </button>
                </div>
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
          isDark={isDark}
        />
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center my-auto border transition-all bg-white border-slate-200/80 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Warning Icon with Glow Ring */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 ring-8 ring-rose-50/80 dark:ring-rose-500/5 shadow-inner">
              <AlertTriangle size={26} className="animate-bounce" style={{ animationDuration: '2s' }} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold tracking-tight">Delete Book</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to delete this book? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-rose-600/25 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}