import { useState, useEffect, useMemo } from "react";
import { api } from "../../data/api";
import Pagination from "../../hooks/Pagination";

export const academicYearApi = {
  getAll: () => api.get("/academic-years/index"),
  create: (data) => api.post("/academic-years/store", data),
  update: (id, data) => api.put(`/academic-years/update/${id}`, data),
  delete: (id) => api.delete(`/academic-years/destroy/${id}`),
};

export default function AcademicYearManager() {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
      setAcademicYears([]);
      setFeedback({ type: "error", text: "Failed to load academic years." });
    } finally {
      setLoading(false);
    }
  };

  const safeAcademicYears = Array.isArray(academicYears) ? academicYears : [];
  const totalPages = Math.ceil(safeAcademicYears.length / itemsPerPage) || 1;

  // Keep currentPage within valid bounds if items are deleted
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
    <div className="bg-white lg:min-w-160 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg p-6 dark:shadow-none space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Academic Years Management
          </h2>
          <p className="text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            Configure school years and active session status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-white bg-blue-600 hover:bg-blue-500 shadow-sm active:scale-95"
        >
          + Add Academic Year
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-indigo-500"></div>
            <span className="text-sm font-semibold">
              Loading academic years...
            </span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto ">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold uppercase tracking-wider border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/75 dark:bg-slate-800/40">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Start Date</th>
                <th className="px-5 py-3.5">End Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm font-medium divide-slate-100 dark:divide-slate-800">
              {currentAcademicYears.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-12 text-slate-400 dark:text-slate-500"
                  >
                    No academic years found.
                  </td>
                </tr>
              ) : (
                currentAcademicYears.map((year) => (
                  <tr
                    key={year.id}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {year.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDateForInput(year.start_date)}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDateForInput(year.end_date)}
                    </td>
                    <td className="px-5 py-4">
                      {year.is_current ? (
                        <span className="px-3 py-1 text-xs font-bold rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                          Current Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(year)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(year.id)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20"
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

      {/* Pagination Integration */}
      {!loading && academicYears.length > 0 && (
        <div className="pt-4 border-t flex justify-end border-slate-100 dark:border-slate-800">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="rounded-lg max-w-md w-full p-6  border transition-all bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            <h3 className="text-lg font-extrabold mb-5 text-slate-900 dark:text-slate-100">
              {editingId ? "Edit Academic Year" : "Add New Academic Year"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">
                  Name (e.g., 2026-2027)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="2026-2027"
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-800/85 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-slate-800/85 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-slate-800/85 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={formData.is_current}
                    onChange={handleChange}
                    className="w-4 h-4 rounded focus:ring-indigo-500 cursor-pointer text-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Set as Current Active Year
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2.5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer bg-blue-600 hover:bg-blue-500 shadow-sm active:scale-95"
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
