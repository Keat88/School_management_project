import { useState, useEffect, useMemo } from "react";
import { api } from "../../data/api";
import Pagination from "../../hooks/Pagination";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Clock,
} from "lucide-react";
import { colorbtn, colorform } from "../../data/datafeature";
import ModalDelete from "../../hooks/ModalDelete";

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

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [academicYearToDelete, setAcademicYearToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setAcademicYearToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!academicYearToDelete) return;
    try {
      await academicYearApi.delete(academicYearToDelete);
      setFeedback({
        type: "success",
        text: "Academic year deleted successfully!",
      });
      setIsDeleteModalOpen(false);
      setAcademicYearToDelete(null);
      fetchAcademicYears();
    } catch (error) {
      setFeedback({ type: "error", text: "Failed to delete academic year." });
      setIsDeleteModalOpen(false);
      setAcademicYearToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAcademicYearToDelete(null);
  };

  return (
    <div className="space-y-6  bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Academic Years Management
            </h2>
            <p className="text-xs sm:text-sm font-medium mt-0.5 text-slate-500 dark:text-slate-400">
              Configure school years and active session status.
            </p>
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className={colorbtn.btnadd}>
          <Plus size={16} strokeWidth={2.5} />
          Add Academic Year
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold border transition-all animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={18}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="shrink-0 text-rose-600 dark:text-rose-400"
            />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all">
        {loading ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-indigo-400"></div>
              <span className="text-xs font-semibold tracking-wide uppercase">
                Loading academic years...
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto border border-slate-200/80 dark:border-slate-800 ">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/50">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm font-medium divide-slate-100 dark:divide-slate-800/60">
                {currentAcademicYears.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-16 text-slate-400 dark:text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Calendar
                          size={36}
                          className="text-slate-300 dark:text-slate-700 stroke-1"
                        />
                        <p className="text-sm font-medium">
                          No academic years found.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentAcademicYears.map((year) => (
                    <tr
                      key={year.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        {year.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateForInput(year.start_date)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {formatDateForInput(year.end_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {year.is_current ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                            <CheckCircle2 size={12} />
                            Current Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                            <Clock size={12} />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(year)}
                          className={colorbtn.btnedit}
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(year.id)}
                          className={colorbtn.btndelete}
                        >
                          <Trash2 size={12} />
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
          <div className="p-4 border-t flex justify-end border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-150">
          <div className="rounded-lg max-w-md w-full p-6 border shadow-2xl transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 my-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
                {editingId ? "Edit Academic Year" : "Add New Academic Year"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

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
                  className={colorform.color_input}
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
                  className={colorform.color_input}
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
                  className={colorform.color_input}
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-3 cursor-pointer p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 w-full hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={formData.is_current}
                    onChange={handleChange}
                    className="w-4 h-4 rounded focus:ring-blue-500 cursor-pointer text-blue-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                    Set as Current Active Year
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2.5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={colorbtn.btncancel}
                >
                  Cancel
                </button>
                <button type="submit" className={colorbtn.btnsave}>
                  {editingId ? "Update Academic Year" : "Save Academic Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <ModalDelete
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title={"Delete Academic Year"}
            desciption={
              " Are you sure you want to delete this academic year? This action cannot be undone."
            }
          />
        </div>
      )}
    </div>
  );
}
