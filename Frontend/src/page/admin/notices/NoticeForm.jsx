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

  // Fetch notice data if editing (Fixed loading state to wait until data is fetched)
  useEffect(() => {
    if (!propNotice && id) {
      NoticeApi.getShow(id)
        .then((response) =>
          setFetchedNotice(response.data.data || response.data),
        )
        .catch((error) => console.log("Failed to load notice data", error))
        .finally(() => setLoading(false));
    }
  }, [propNotice, id]);

  // Populate form fields
  useEffect(() => {
    if (currentNotice) {
      setFormData({
        title: currentNotice.title || "",
        content: currentNotice.content || "",
        target_audience: currentNotice.target_audience || "all",
        target_id: currentNotice.target_id || "",
        publish_date: currentNotice.publish_date
          ? currentNotice.publish_date.split("T")[0]
          : getTodayDate(),
        attachment: null,
      });
      if (currentNotice.attachment) {
        const parts = currentNotice.attachment.split("/");
        setFileName(parts[parts.length - 1]);
      }
    }
  }, [currentNotice]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await teacherApi.getAll();
        setTeachers(response.data);
      } catch (error) {
        console.log("Failed to fetch teachers", error);
      }
      setLoading(false);
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
        response = await NoticeApi.update(activeId, data);
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
      setTimeout(() => navigate("/notices"), 1000);
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
    <>
      {loading ? (
        <div className="flex text-center justify-center items-center min-h-screen bg-white w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="min-w-160 mx-auto p-6 rounded-xl border border-gray-200 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              {isEdit ? "Edit Notice" : "Create New Notice"}
            </h2>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {feedback.type === "error" && <AlertCircle size={18} />}
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notice title"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                placeholder="Enter notice content..."
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.content
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience *
                </label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="all_teachers">All Teachers</option>
                  <option value="single_teacher">Single Teacher</option>
                  <option value="single_class">Single Class</option>
                </select>
                {errors.target_audience && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.target_audience[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date *
                </label>
                <input
                  type="date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                    errors.publish_date
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.publish_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.publish_date[0]}
                  </p>
                )}
              </div>
            </div>

            {formData.target_audience === "single_class" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Class ID *
                </label>
                <input
                  type="number"
                  name="target_id"
                  value={formData.target_id}
                  onChange={handleChange}
                  placeholder="Enter class ID number"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.target_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.target_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.target_id[0]}
                  </p>
                )}
              </div>
            )}

            {formData.target_audience === "single_teacher" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Teacher *
                </label>
                <select
                  name="target_id"
                  value={formData.target_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 ${
                    errors.target_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">-- Choose a Teacher --</option>
                  {teachers?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.target_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.target_id[0]}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment (PDF, JPEG, PNG, JPG - Max 2MB)
              </label>
              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                  errors.attachment
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <Upload className="text-gray-400 mb-1" size={20} />
                <span className="text-xs text-gray-600 font-medium">
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.attachment[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
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
    </>
  );
}
