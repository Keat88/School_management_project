import { useState, useEffect } from "react";
import { Layers, Search, Plus, Loader2, Trash, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../../data/api";
import Pagination from "../../../../hooks/Pagination";
import { colorbtn } from "../../../../data/datafeature";

export default function CourseCategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await api.get("course-categories");
        if (!isMounted) return;
        if (res.data.status === "success") {
          setCategories(res.data.data);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load categories:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 lg:min-w-160 mx-auto text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header & Search/Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Layers className="text-slate-600 dark:text-slate-400" size={20} />
            Course Categories
          </h2>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
            Manage course categories and monitor associated course counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-60 pl-9 pr-3.5 py-2 rounded-lg border text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 transition-colors"
            />
          </div>

          <Link
            to={"/admin/course/category/add"}
            className={colorbtn.btnadd}
          >
            <Plus size={14} /> Add Category
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Icon</th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Courses Count</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {currentCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium"
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
                  className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                >
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {category.icon || "—"}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {category.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {category.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {category.courses_count ?? 0} courses
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className={colorbtn.btnedit}
                    >
                      <Edit size={16}/>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                       className={colorbtn.btndelete}
                    >
                      <Trash size={16}/>
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
