import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, Filter, RotateCcw, BookOpen } from "lucide-react";
import { BookApi } from "../../../data/library";
import Pagination from "../../../hooks/Pagination";

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
      const activePage =
        rawData?.meta?.current_page || rawData?.current_page || page;

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await BookApi.delete(id);
      setFeedback({ type: "success", text: "Book deleted successfully!" });
      fetchBooks(currentPage, { search, isbn, category });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete book.",
      });
    }
  };

  return (
    <div className={`w-full lg:min-w-160 mx-auto space-y-6 px-4 py-4 transition-colors ${isDark ? "text-slate-100" : "text-gray-900"}`}>
      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b ${
        isDark ? "border-slate-800" : "border-gray-100"
      }`}>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            Manage Books
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Browse, search, filter, and modify library items
          </p>
        </div>
        <NavLink
          to="/admin/library/book/add"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-blue-700 transition-colors shadow-sm active:scale-95 duration-150"
        >
          <Plus size={16} />
          <span>Add New Book</span>
        </NavLink>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? isDark
                ? "bg-green-950/40 text-green-400 border-green-900/60"
                : "bg-green-50 text-green-700 border-green-200"
              : isDark
                ? "bg-red-950/40 text-red-400 border-red-900/60"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Responsive Filter/Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border shadow-sm transition-colors ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-gray-50 border-gray-200/80"
        }`}
      >
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 ${isDark ? "text-slate-500" : "text-gray-400"}`} size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author..."
            className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Filter by ISBN..."
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filter by category..."
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Filter size={15} />
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            title="Reset Filters"
          >
            <RotateCcw size={15} />
            <span className="sr-only md:not-sr-only">Reset</span>
          </button>
        </div>
      </form>

      {/* Desktop & Tablet Table View (Hidden on small mobile screens) */}
      <div className={`hidden md:block rounded-xl border overflow-hidden shadow-sm transition-colors ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${
              isDark ? "bg-slate-800/60 border-slate-800 text-slate-400" : "bg-gray-50 border-gray-100 text-gray-500"
            }`}>
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Title & Author</th>
              <th className="py-3.5 px-4">ISBN</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-center">Copies</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${
            isDark ? "divide-slate-800 text-slate-300" : "divide-gray-100 text-gray-700"
          }`}>
            {loading ? (
              <tr>
                <td colSpan="6" className={`py-12 text-center ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
                      isDark ? "border-indigo-400" : "border-indigo-300"
                    }`}></div>
                    <span>Loading books...</span>
                  </div>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="6" className={`py-12 text-center ${isDark ? "text-slate-400" : "text-gray-400"}`}>
                  <BookOpen className="mx-auto mb-2 opacity-50" size={32} />
                  <span>No books found matching your criteria.</span>
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/40" : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    {book.book_image ? (
                      <img
                        src={book.book_image}
                        alt={book.title}
                        className={`w-10 h-14 object-cover rounded border shadow-xs ${
                          isDark ? "border-slate-700" : "border-gray-200"
                        }`}
                      />
                    ) : (
                      <div className={`w-10 h-14 rounded border flex items-center justify-center text-[10px] font-medium text-center px-1 ${
                        isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}>
                        No Cover
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className={`font-semibold truncate ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                      {book.title}
                    </p>
                    <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                      {book.author}
                    </p>
                  </td>
                  <td className={`py-3.5 px-4 font-mono text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                    {book.isbn || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium border ${
                      isDark 
                        ? "bg-slate-800 border-slate-700 text-slate-300" 
                        : "bg-gray-100 border-gray-200 text-gray-700"
                    }`}>
                      {book.category?.book_category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isDark
                        ? "bg-blue-950/40 text-blue-400 border-blue-900/60"
                        : "bg-blue-50 text-blue-500 border-blue-100/40"
                    }`}>
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() =>
                        navigate(`/admin/library/book/add/${book.id}`)
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-block border ${
                        isDark
                          ? "text-indigo-400 bg-indigo-950/40 border-indigo-900/60 hover:bg-indigo-900/50"
                          : "text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-200"
                      }`}
                      title="Update"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-block border ${
                        isDark
                          ? "text-red-400 bg-red-950/40 border-red-900/60 hover:bg-red-900/50"
                          : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                      }`}
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

      {/* Mobile Card Layout (Rendered for small screens) */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className={`py-12 text-center rounded-xl border p-6 ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-gray-200 text-gray-400"
          }`}>
            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2 ${
              isDark ? "border-indigo-400" : "border-blue-600"
            }`}></div>
            <span>Loading books...</span>
          </div>
        ) : books.length === 0 ? (
          <div className={`py-12 text-center rounded-xl border p-6 ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-gray-200 text-gray-400"
          }`}>
            <BookOpen className="mx-auto mb-2 opacity-50" size={32} />
            <span>No books found matching your criteria.</span>
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className={`border rounded-xl p-4 shadow-xs flex flex-col gap-3 transition-colors ${
                isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex gap-3">
                {book.book_image ? (
                  <img
                    src={book.book_image}
                    alt={book.title}
                    className={`w-14 h-20 object-cover rounded border shrink-0 ${
                      isDark ? "border-slate-700" : "border-gray-200"
                    }`}
                  />
                ) : (
                  <div className={`w-14 h-20 rounded border flex items-center justify-center text-[10px] font-medium text-center shrink-0 p-1 ${
                    isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-100 border-gray-200 text-gray-400"
                  }`}>
                    No Cover
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-base leading-tight truncate ${isDark ? "text-slate-100" : "text-gray-800"}`}>
                    {book.title}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{book.author}</p>

                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-700"
                    }`}>
                      {book.category?.book_category || "Uncategorized"}
                    </span>
                    <span className={`font-mono text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                      ISBN: {book.isbn || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t text-xs ${
                isDark ? "border-slate-800" : "border-gray-100"
              }`}>
                <div>
                  <span className={isDark ? "text-slate-400" : "text-gray-500"}>Available: </span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? "bg-blue-950/40 text-blue-400 border-blue-900/60"
                      : "bg-blue-50 text-blue-700 border-blue-100/40"
                  }`}>
                    {book.available_copies} / {book.total_copies} copies
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/library/book/add/${book.id}`)
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                      isDark
                        ? "text-indigo-400 bg-indigo-950/40 border-indigo-900/60 hover:bg-indigo-900/50"
                        : "text-gray-700 bg-gray-100 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                      isDark
                        ? "text-red-400 bg-red-950/40 border-red-900/60 hover:bg-red-900/50"
                        : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                    }`}
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
    </div>
  );
}