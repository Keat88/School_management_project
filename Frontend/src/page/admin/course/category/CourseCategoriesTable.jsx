import { useState, useEffect } from "react";
import { Layers, Edit, Trash2, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../../data/api";
import Pagination from "../../../../hooks/Pagination";

export default function CourseCategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("course-categories");
        if (res.data.status === "success") {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleEdit = (id) => {
    navigate(`/admin/course/category/add/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await api.delete(`course-categories/${id}`);
        if (
          res.status === 200 ||
          res.status === 204 ||
          res.data?.status === "success"
        ) {
          setCategories(categories.filter((cat) => cat.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  return (
    <div className="space-y-6 lg:min-w-160 mx-auto text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Layers className="text-blue-500 dark:text-indigo-400" size={22} />
            Course Categories
          </h2>
          <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
            Manage course categories and monitor associated course counts.
          </p>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by category name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-600 dark:focus:border-blue-500"
            />
          </div>
          <Link
            to={"/admin/course/category/add"}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg border border-gray-50 dark:border-slate-700 px-3 py-2 duration-200 transition-transform cursor-pointer font-medium"
          >
            + Add Category
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <th className="py-3 px-4 font-semibold">Icon</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Slug</th>
              <th className="py-3 px-4 font-semibold">Courses Count</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-slate-400 dark:text-slate-500"
                >
                  <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                  </div>
                </td>
              </tr>
            ) : currentCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-slate-400 dark:text-slate-500"
                >
                  {categories.length === 0
                    ? "No categories found."
                    : "No matching categories found."}
                </td>
              </tr>
            ) : (
              currentCategories.map((category) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {category.icon || "—"}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">
                    {category.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {category.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/60">
                      {category.courses_count ?? 0} courses
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="px-2 py-1 rounded-lg border transition-colors cursor-pointer border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Edit"
                    >
                     Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-2 py-1 rounded-lg border transition-colors cursor-pointer border-red-100 dark:border-red-950 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
