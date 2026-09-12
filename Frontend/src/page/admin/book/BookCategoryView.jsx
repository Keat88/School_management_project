import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Eye, BookOpen, AlertCircle } from "lucide-react";
import { BookCategoryApi } from "../../../data/library";

export default function BookCategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [bookSearch, setBookSearch] = useState("");

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoading(true);
      try {
        const res = await BookCategoryApi.getShow(id);
        setCategory(res?.data?.data || res?.data || res);
      } catch (error) {
        setFeedback({
          type: "error",
          text: error.response?.data?.message || "Failed to load category details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  // Filter books locally to handle large lists efficiently
  const filteredBooks = category?.books?.filter((book) =>
    book.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(bookSearch.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-slate-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-500 dark:border-indigo-400"></div>
          <span>Loading book category details...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl border shadow-sm text-center transition-colors duration-200 bg-white border-gray-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
        <p className="text-rose-600 dark:text-rose-400 mb-4 font-medium">
          {feedback?.text || "Category not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto p-6 sm:p-8 rounded-lg border transition-colors duration-200 bg-white border-gray-200/80 text-gray-900 shadow-gray-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:shadow-slate-950/40 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-slate-100">
          <BookOpen className="text-indigo-600 dark:text-indigo-400" size={24} />
          Category View
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700 flex items-center gap-1.5"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl text-sm font-medium border flex items-center gap-2.5 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/40">
          <AlertCircle size={18} className="shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Category Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl border transition-colors bg-gray-50/60 border-gray-200/60 dark:bg-slate-800/50 dark:border-slate-800">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Category Name
          </span>
          <p className="font-semibold text-base mt-0.5 text-gray-900 dark:text-slate-100">
            {category.book_category}
          </p>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Total Books
          </span>
          <p className="font-semibold text-base mt-0.5 text-gray-900 dark:text-slate-100">
            {category.books?.length || 0} books
          </p>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Created Date
          </span>
          <p className="font-medium text-sm mt-0.5 text-gray-700 dark:text-slate-300">
            {category.created_at ? new Date(category.created_at).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>

      {/* Books Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Books in this Category
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 text-gray-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder="Search books by title, author..."
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Scrollable Container with Sticky Header */}
        <div className="overflow-x-auto border rounded-2xl max-h-[450px] overflow-y-auto border-gray-200/80 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 text-xs font-semibold uppercase tracking-wider z-10 shadow-sm bg-gray-50/90 text-gray-500 border-b border-gray-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4 text-center">Copies</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm divide-gray-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 dark:text-slate-500">
                    {bookSearch ? "No books match your search." : "No books available in this category."}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      {book.book_image ? (
                        <img
                          src={book.book_image}
                          alt={book.title}
                          className="w-10 h-12 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-12 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 text-[10px] font-medium">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">{book.title}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-slate-300">{book.author}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500 dark:text-slate-400">{book.isbn || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                        {book.available_copies} / {book.total_copies}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/books/view/${book.id}`)}
                        className="p-2 rounded-xl transition-all cursor-pointer text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 inline-block"
                        title="View Book"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}