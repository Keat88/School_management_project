import { useState, useEffect } from "react";
import { classRoomApi } from "../../data/classrooms";

export default function ClassRoomForm({ item = null, onSuccess }) {
  const isEdit = Boolean(item);

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
    grade: "",
    section: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Populate form fields if editing an existing record
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || item.academic_year?.name || "",
        start_date: item.start_date || item.academic_year?.start_date || "",
        end_date: item.end_date || item.academic_year?.end_date || "",
        is_current: item.is_current ?? item.academic_year?.is_current ?? false,
        grade: item.grade || "",
        section: item.section || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isEdit) {
        await classRoomApi.upDate(item.id, formData);
        setFeedback({ type: "success", text: "Class updated successfully!" });
      } else {
        await classRoomApi.addNew(formData);
        setFeedback({ type: "success", text: "Class created successfully!" });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Class & Academic Year" : "Add New Class & Academic Year"}
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic Year Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Academic Year Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Academic Year Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 2025-2026"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="is_current"
                id="is_current"
                checked={formData.is_current}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_current" className="text-sm font-medium text-gray-700 select-none">
                Set as Current Academic Year
              </label>
            </div>
          </div>
        </div>

        {/* Classroom Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Classroom Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Grade</label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. 10"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g. A"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            
            className="px-6 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Class" : "Save Class"}
          </button>
        </div>
      </form>
    </div>
  );
}