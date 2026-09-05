import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { BookApi } from "../../../data/library";
export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");

  const fetchBooks = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await BookApi.getAll(filters);
      setBooks(res.data || res);
    } catch (error) {
      setBooks([]);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to load books.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks({ search, isbn, category });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await BookApi.delete(id);
      setFeedback({ type: "success", text: "Book deleted successfully!" });
      fetchBooks({ search, isbn, category });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete book.",
      });
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Manage Books</h2>
        <NavLink
          to="/library/book/add"
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add New Book
        </NavLink>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Filter / Search Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 rounded-xl"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Filter by ISBN..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Filter by category..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setIsbn("");
              setCategory("");
              fetchBooks();
            }}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Books Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title & Author</th>
              <th className="py-3 px-4">ISBN</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Copies</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  Loading books...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    {book.book_image ? (
                      <img
                        src={book.book_image}
                        alt={book.title}
                        className="w-10 h-12 object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-800">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">
                    {book.isbn || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      {book.category?.book_category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => navigate(`/library/book/add/${book.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                      title="Update"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
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
    </div>
  );
}
