import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";
import { BookCategoryApi } from "../../../data/library";

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchCategories = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await BookCategoryApi.getAll({
        search: searchTerm,
      });
      setCategories(res.data || res);
    } catch (error) {
      setCategories([]);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to load categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCategories(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await BookCategoryApi.delete(id);
      setFeedback({ type: "success", text: "Category deleted successfully!" });
      fetchCategories(search);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete category.",
      });
    }
  };

  return (
    <div className="min-w-160 mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          Manage Book Categories
        </h2>
        <NavLink
          to="/library/category/add"
          className="flex items-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </NavLink>
      </div>

      {feedback && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-400">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {cat.book_category}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {cat.created_at
                      ? new Date(cat.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() =>
                        navigate(`/library/category/view/:${cat.id}`)
                      }
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-block"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/library/category/add/${cat.id}`)
                      }
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                      title="Update"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
