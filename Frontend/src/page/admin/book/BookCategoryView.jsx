import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Eye, BookOpen } from "lucide-react";


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
        const res = await BookCategoryView.getShow(id);
        setCategory(res.data || res);
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
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading category details...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <p className="text-red-500 mb-4">{feedback?.text || "Category not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          Category View
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

      {feedback && (
        <div className="p-4 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200">
          {feedback.text}
        </div>
      )}

      {/* Category Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div>
          <span className="block text-xs font-semibold text-gray-400 uppercase">Category Name</span>
          <p className="text-gray-800 font-semibold text-base mt-0.5">{category.book_category}</p>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-400 uppercase">Total Books</span>
          <p className="text-gray-800 font-semibold text-base mt-0.5">{category.books?.length || 0} books</p>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-400 uppercase">Created Date</span>
          <p className="text-gray-800 font-medium text-sm mt-0.5">
            {category.created_at ? new Date(category.created_at).toLocaleDateString() : "-"}
          </p>
        </div>
      </div>

      {/* Books Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-md font-bold text-gray-700">Books in this Category</h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              placeholder="Search books by title, author..."
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Scrollable Container with Sticky Header for Handling Many Books */}
        <div className="overflow-x-auto border border-gray-100 rounded-lg max-h-[450px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase z-10 shadow-sm">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4 text-center">Copies</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    {bookSearch ? "No books match your search." : "No books available in this category."}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
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
                    <td className="py-3 px-4 font-medium text-gray-800">{book.title}</td>
                    <td className="py-3 px-4 text-gray-600">{book.author}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{book.isbn || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {book.available_copies} / {book.total_copies}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/books/view/${book.id}`)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-block"
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