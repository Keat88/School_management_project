import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { teacherApi } from "../../../data/TeacherApi";
import { NoticeApi } from "../../../data/notices";

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function NoticeForm({ notice: propNotice = null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState({});
  const [fetchedNotice, setFetchedNotice] = useState(null);
  const currentNotice = propNotice || fetchedNotice;
  const activeId = propNotice?.id || id;
  const isEdit = Boolean(activeId);

  const [teachers, setTeachers] = useState([]);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    target_audience: "all",
    target_id: "",
    publish_date: getTodayDate(),
    attachment: null,
  });

  useEffect(() => {
    if (!propNotice && id) {
      setLoading(true);
      NoticeApi.getShow(id)
        .then((response) =>
          setFetchedNotice(response.data?.data || response.data),
        )
        .catch((error) => console.log("Failed to load notice data", error))
        .finally(() => setLoading(false));
    }
  }, [propNotice, id]);

  useEffect(() => {
    if (currentNotice) {
      setFormData({
        title: currentNotice.title || "",
        content: currentNotice.content || currentNotice.description || "",
        target_audience: currentNotice.target_audience || "all",
        target_id: currentNotice.target_id || "",
        publish_date: currentNotice.publish_date
          ? currentNotice.publish_date.split("T")[0]
          : getTodayDate(),
        attachment: null,
      });
      if (currentNotice.attachment || currentNotice.file) {
        const filePath = currentNotice.attachment || currentNotice.file;
        const parts = filePath.split("/");
        setFileName(parts[parts.length - 1]);
      }
    }
  }, [currentNotice]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await teacherApi.getAll();
        const teacherData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setTeachers(teacherData);
      } catch (error) {
        console.log("Failed to fetch teachers", error);
        setTeachers([]);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (
        name === "target_audience" &&
        !["single_teacher", "single_class"].includes(value)
      ) {
        updated.target_id = "";
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, attachment: file }));
      setFileName(file.name);
      if (errors.attachment)
        setErrors((prev) => ({ ...prev, attachment: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    setErrors({});

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const userId = storedUser.id;

    const data = new FormData();
    if (userId) data.append("user_id", userId);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("target_audience", formData.target_audience);
    data.append("publish_date", formData.publish_date);

    if (
      ["single_teacher", "single_class"].includes(formData.target_audience) &&
      formData.target_id
    ) {
      data.append("target_id", formData.target_id);
    }

    if (formData.attachment instanceof File) {
      data.append("attachment", formData.attachment);
    }

    if (isEdit) {
      data.append("_method", "PUT");
    }

    try {
      let response;
      if (isEdit) {
        response = await NoticeApi.update(data, activeId);
      } else {
        response = await NoticeApi.addNew(data);
      }

      setFeedback({
        type: "success",
        text:
          response?.message ||
          (isEdit
            ? "Notice updated successfully!"
            : "Notice created successfully!"),
      });
      setTimeout(() => navigate("/admin/notices"), 1000);
    } catch (error) {
      if (error.response?.status === 422 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
        setFeedback({
          type: "error",
          text: "Please fix the highlighted errors below.",
        });
      } else {
        setFeedback({
          type: "error",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:min-w-160 mx-auto  transition-colors">
      {loading && !currentNotice ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <div className="w-6 h-6 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Loading {id ? "update..." : "create..."}
          </span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 sm:p-6 lg:p-8 space-y-6 shadow-xs transition-colors">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-slate-100">
              {isEdit ? "Edit Notice" : "Create New Notice"}
            </h2>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50"
                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50"
              }`}
            >
              {feedback.type === "error" && (
                <AlertCircle size={18} className="shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notice title"
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.title[0]}
                </p>
              )}
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Enter notice content..."
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${
                  errors.content
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                }`}
              />
              {errors.content && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.content[0]}
                </p>
              )}
            </div>

            {/* Target Audience & Publish Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Target Audience *
                </label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="all">All</option>
                  <option value="all_teachers">All Teachers</option>
                  <option value="single_teacher">Single Teacher</option>
                  <option value="single_class">Single Class</option>
                </select>
                {errors.target_audience && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.target_audience[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Publish Date *
                </label>
                <input
                  type="date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.publish_date
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
                {errors.publish_date && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.publish_date[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Target Class ID */}
            {formData.target_audience === "single_class" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Target Class ID *
                </label>
                <input
                  type="number"
                  name="target_id"
                  value={formData.target_id}
                  onChange={handleChange}
                  placeholder="Enter class ID number"
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.target_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
                {errors.target_id && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.target_id[0]}
                  </p>
                )}
              </div>
            )}

            {/* Conditional Teacher Selector */}
            {formData.target_audience === "single_teacher" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Select Teacher *
                </label>
                <select
                  name="target_id"
                  value={formData.target_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
                    errors.target_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                >
                  <option value="">-- Choose a Teacher --</option>
                  {Array.isArray(teachers) &&
                    teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
                {errors.target_id && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.target_id[0]}
                  </p>
                )}
              </div>
            )}

            {/* File Attachment Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Attachment (PDF, JPEG, PNG, JPG - Max 2MB)
              </label>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer transition-colors ${
                  errors.attachment
                    ? "border-red-400 bg-red-50/50 dark:bg-red-950/20"
                    : "border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-slate-800/50"
                }`}
              >
                <Upload
                  className="text-gray-400 dark:text-slate-500 mb-1.5"
                  size={22}
                />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 font-medium text-center truncate max-w-xs">
                  {fileName ? fileName : "Click to upload file"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpeg,.png,.jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {errors.attachment && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.attachment[0]}
                </p>
              )}
            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer text-center shadow-xs"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                    ? "Update Notice"
                    : "Create Notice"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
