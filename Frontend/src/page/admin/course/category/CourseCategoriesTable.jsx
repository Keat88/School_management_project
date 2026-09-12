import { useState, useEffect } from "react";
import { Layers, Edit, Trash2, Search } from "lucide-react";
import { api } from "../../../../data/api";
import { Link } from "react-router-dom";
export default function CourseCategoriesTable({ isDark = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api
      .get("/course-categories")
      .then((res) => {
        if (res.data.status === "success") {
          setCategories(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className={`space-y-6 lg:min-w-160 mx-auto p-6 rounded-2xl border shadow-xs ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            <Layers className="text-blue-600" size={22} />
            Course Categories
          </h2>
          <p
            className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Manage course categories and monitor associated course counts.
          </p>
        </div>
        <div className="flex items-center gap-x-0.5">
          <div className="relative">
            <span
              className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-blue-900 focus:border-blue-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600"
              }`}
            />
          </div>
          <Link to={'/admin/course/category/add'} className="bg-blue-600  text-sm hover:bg-blue-500 text-white rounded-xl border border-gray-50 px-1 py-2 duration-200 transition-transform ">
            +Add Category
          </Link>
        </div>
      </div>

      <div
        className={`overflow-x-auto rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}`}
      >
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr
              className={`border-b ${
                isDark
                  ? "bg-slate-800/50 border-slate-800 text-slate-300"
                  : "bg-gray-50 border-slate-200 text-slate-700"
              }`}
            >
              <th className="py-3 px-4 font-semibold">Icon</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Slug</th>
              <th className="py-3 px-4 font-semibold">Courses Count</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-200"}`}
          >
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className={`py-8 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Loading categories...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className={`py-8 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  {categories.length === 0
                    ? "No categories found."
                    : "No matching categories found."}
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  }`}
                >
                  <td
                    className={`py-3 px-4 font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {category.icon || "—"}
                  </td>
                  <td
                    className={`py-3 px-4 font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}
                  >
                    {category.name}
                  </td>
                  <td
                    className={`py-3 px-4 font-mono text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {category.slug}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isDark
                          ? "bg-blue-950/50 text-blue-400 border-blue-900/60"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {category.courses_count ?? 0} courses
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                          : "border-slate-200 hover:bg-slate-100 text-slate-600"
                      }`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? "border-red-950 bg-red-950/20 hover:bg-red-950/40 text-red-400"
                          : "border-red-100 bg-red-50 hover:bg-red-100 text-red-600"
                      }`}
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
