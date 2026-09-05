import { useState, useEffect } from "react";
import { api } from "../../data/api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await academicYearApi.getAll();
      setAcademicYears(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to load academic years", error);
      setFeedback({ type: "error", text: "Failed to load academic years." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (year = null) => {
    if (year) {
      setEditingId(year.id);
      setFormData({
        name: year.name,
        start_date: year.start_date,
        end_date: year.end_date,
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
        setTimeout(() => {
          navigate("/academic-year");
        }, 2000);
      } else {
        await academicYearApi.create(formData);
        setTimeout(() => {
          setFeedback({
            type: "success",
            text: "Academic year created successfully!",
          });
        }, 2000);
      }
      setIsModalOpen(false);
      fetchAcademicYears();
    } catch (error) {
      setTimeout(() => {
        setFeedback({
          type: "error",
          text:
            error.response?.data?.message ||
            "Operation failed. Check your data.",
        });
      }, 2000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic year?"))
      return;
    try {
      await academicYearApi.delete(id);
      setTimeout(() => {
        setFeedback({
          type: "success",
          text: "Academic year deleted successfully!",
        });
      }, 2000);
      fetchAcademicYears();
    } catch (error) {
      setFeedback({ type: "error", text: "Failed to delete academic year." });
    }
  };

  return (
    <div className="min-w-160 mx-auto p-6  rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Academic Years Management
          </h2>
          <p className="text-sm text-gray-500">
            Configure school years and active session status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Add Academic Year
        </button>
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

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading academic years...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                <th className="p-3">Name</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {academicYears.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No academic years found.
                  </td>
                </tr>
              ) : (
                academicYears.map((year) => (
                  <tr key={year.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">
                      {year.name}
                    </td>
                    <td className="p-3 text-gray-600">{year.start_date}</td>
                    <td className="p-3 text-gray-600">{year.end_date}</td>
                    <td className="p-3">
                      {year.is_current ? (
                        <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                          Current Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(year)}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(year.id)}
                        className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? "Edit Academic Year" : "Add New Academic Year"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Name (e.g., 2026-2027)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="2026-2027"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={formData.is_current}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-600">
                    Set as Current Active Year
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
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
