import { useState, useEffect, useMemo } from "react";
import { api } from "../../data/api";
import { useNavigate } from "react-router-dom";
import Pagination from "../../hooks/Pagination";

export const academicYearApi = {
  getAll: () => api.get("/academic-years/index"),
  create: (data) => api.post("/academic-years/store", data),
  update: (id, data) => api.put(`/academic-years/update/${id}`, data),
  delete: (id) => api.delete(`/academic-years/destroy/${id}`),
};

export default function AcademicYearManager({ isDark = true }) {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
  });

  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  // Helper to extract YYYY-MM-DD for <input type="date" />
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await academicYearApi.getAll();

      const data =
        response?.data?.data?.data ||
        response.data?.data ||
        response.data ||
        [];
      setAcademicYears(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load academic years", error);
      setAcademicYears([]); // Fallback to an empty array on error
      setFeedback({ type: "error", text: "Failed to load academic years." });
    } finally {
      setLoading(false);
    }
  };

  // Safe client-side pagination calculation
  const safeAcademicYears = Array.isArray(academicYears) ? academicYears : [];

  const totalPages = Math.ceil(safeAcademicYears.length / itemsPerPage) || 1;

  const currentAcademicYears = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return safeAcademicYears.slice(start, start + itemsPerPage);
  }, [safeAcademicYears, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (year = null) => {
    if (year) {
      setEditingId(year.id);
      setFormData({
        name: year.name || "",
        start_date: formatDateForInput(year.start_date),
        end_date: formatDateForInput(year.end_date),
        is_current: Boolean(year.is_current),
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        is_current: false,
      });
    }
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await academicYearApi.update(editingId, formData);
        setFeedback({
          type: "success",
          text: "Academic year updated successfully!",
        });
      } else {
        await academicYearApi.create(formData);
        setFeedback({
          type: "success",
          text: "Academic year created successfully!",
        });
      }
      setIsModalOpen(false);
      fetchAcademicYears();
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message || "Operation failed. Check your data.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic year?"))
      return;
    try {
      await academicYearApi.delete(id);
      setFeedback({
        type: "success",
        text: "Academic year deleted successfully!",
      });
      fetchAcademicYears();
    } catch (error) {
      setFeedback({ type: "error", text: "Failed to delete academic year." });
    }
  };

  return (
    <div className={`border rounded-2xl p-5 shadow-sm space-y-4 transition-colors ${
      isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-200 text-gray-800"
    }`}>
      {/* Header */}
      <div className={`flex justify-between items-center pb-4 border-b ${
        isDark ? "border-slate-800" : "border-gray-100"
      }`}>
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            Academic Years Management
          </h2>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Configure school years and active session status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-white ${
            isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          + Add Academic Year
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border transition-all ${
            feedback.type === "success"
              ? isDark
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-green-50 text-green-700 border-green-200"
              : isDark
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className={`py-12 text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
              isDark ? "border-indigo-500" : "border-blue-600"
            }`}></div>
            <span>Loading Academic years...</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase ${
                isDark ? "border-slate-800 text-slate-400 bg-slate-800/50" : "border-gray-200 text-gray-500 bg-gray-50"
              }`}>
                <th className="p-3">Name</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${
              isDark ? "divide-slate-800" : "divide-gray-100"
            }`}>
              {currentAcademicYears.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`text-center py-8 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    No academic years found.
                  </td>
                </tr>
              ) : (
                currentAcademicYears.map((year) => (
                  <tr
                    key={year.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-slate-800/50" : "hover:bg-gray-50/80"
                    }`}
                  >
                    <td className={`p-3 font-medium ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                      {year.name}
                    </td>
                    <td className={`p-3 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                      {formatDateForInput(year.start_date)}
                    </td>
                    <td className={`p-3 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                      {formatDateForInput(year.end_date)}
                    </td>
                    <td className="p-3">
                      {year.is_current ? (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          isDark
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          Current Active
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          isDark
                            ? "bg-slate-800 text-slate-400 border-slate-700"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(year)}
                        className={`px-3 py-1 text-md font-medium rounded-lg transition-colors cursor-pointer ${
                          isDark
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(year.id)}
                        className={`px-3 py-1 text-md font-medium rounded-lg border transition-colors cursor-pointer ${
                          isDark
                            ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                            : "bg-red-50 text-rose-600 border-rose-200 hover:bg-red-100"
                        }`}
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
      )}

      {/* Pagination Hook Integration */}
      {!loading && academicYears.length > 0 && (
        <div className={`pt-4 border-t flex justify-end ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isDark={isDark}
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-md w-full p-6 shadow-xl border transition-colors ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-gray-800"
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-slate-100" : "text-gray-800"}`}>
              {editingId ? "Edit Academic Year" : "Add New Academic Year"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Name (e.g., 2026-2027)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="2026-2027"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={formData.is_current}
                    onChange={handleChange}
                    className={`w-4 h-4 rounded focus:ring-indigo-500 ${
                      isDark ? "text-indigo-600 border-slate-700 bg-slate-800" : "text-blue-600 border-gray-300"
                    }`}
                  />
                  <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                    Set as Current Active Year
                  </span>
                </label>
              </div>

              <div className={`flex justify-end space-x-2 pt-4 border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer ${
                    isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}