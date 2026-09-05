import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classRoomApi, Year } from "../../data/classrooms";

export default function ClassForm({ classItem: propClass = null, onSuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const isEditMode = Boolean(propClass || id);
  const classId = propClass?.id || id;

  const [formData, setFormData] = useState({
    name: "",
    academic_year_id: "",
    grade: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!propClass && Boolean(id));
  const [feedback, setFeedback] = useState(null);

  const fetchYears = async () => {
    try {
      const response = await Year.getAll();
      setYears(response?.data?.data || response?.data || response);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (propClass) {
      populateForm(propClass);
    } else if (id) {
      classRoomApi
        .getShow(id)
        .then((response) => {
          const classDataObj = response?.data || response;
          populateForm(classDataObj);
          setFetching(false);
        })
        .catch((error) => {
          console.error("Failed to load class details", error);
          setFetching(false);
          setFeedback({
            type: "error",
            text: "Failed to load class details for editing.",
          });
        });
    }
  }, [propClass, id]);

  const populateForm = (data) => {
    setFormData({
      name: data.name || "",
      academic_year_id: data.academic_year_id || data.year_id || "",
      grade: data.grade || "",
      section: data.section || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      if (isEditMode) {
        await classRoomApi.upDate(formData, classId);
        setFeedback({ type: "success", text: "Class updated successfully!" });
      } else {
        const response = await classRoomApi.addNew(formData);
        setFeedback({ type: "success", text: response?.message || "Class created successfully!" });
      }
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/classes"), 1000);
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please check your inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        Loading class details...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto p-6  rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditMode ? "Edit Class" : "Add New Class"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <span>← Back</span>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
            Class Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Class Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="e.g., Grade 10 A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Academic Year
              </label>
              <select
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Academic Year</option>
                {Array.isArray(years) &&
                  years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Grade
              </label>
              <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                placeholder="e.g., A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : isEditMode ? "Update Class" : "Save Class"}
          </button>
        </div>
      </form>
    </div>
  );
}