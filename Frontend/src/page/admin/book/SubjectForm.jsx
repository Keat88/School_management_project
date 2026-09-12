import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import { api } from "../../../data/api";
import { subjectApi } from "../../../data/classrooms";

export default function SubjectForm({ isDark: propIsDark = false }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "dark" || savedTheme === "true";
    }
    return propIsDark;
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [feedback, setFeedback] = useState(null);

  const [subjectName, setSubjectName] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Sync with localStorage changes across components/tabs if theme toggles elsewhere
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme") || localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark" || savedTheme === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchSubject = async () => {
        try {
          const response = await subjectApi.getShow(id);
          const sub = response.data?.data || response.data;
          setSubjectName(sub.subject_name || "");
          setCode(sub.code || "");
          setImagePreview(sub.image_url || sub.image || null);
        } catch (error) {
          setFeedback({
            type: "error",
            text: "Failed to load subject data for editing.",
          });
        } finally {
          setFetching(false);
        }
      };
      fetchSubject();
    }
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("subject_name", subjectName);
    formData.append("code", code);
    if (image) {
      formData.append("image", image);
    }
    if (isEditing) {
      formData.append("_method", "PUT");
    }

    try {
      const endpoint = isEditing
        ? await subjectApi.upDate(formData, id)
        : await subjectApi.addNew(formData);

      setFeedback({
        type: "success",
        text: isEditing
          ? "Subject updated successfully!"
          : "Subject created successfully!",
      });
      setTimeout(() => {
        navigate("/admin/subjects");
      }, 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to save subject. Please check inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={`max-w-2xl mx-auto py-12 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-400"}`}>
        Loading subject details...
      </div>
    );
  }

  return (
    <div className={` lg:min-w-160 mx-auto space-y-6 transition-colors ${isDark ? "text-slate-100" : "text-gray-900"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/subjects"
            className={`p-2 border rounded-lg transition-colors ${
              isDark
                ? "border-slate-800 text-slate-300 hover:bg-slate-800"
                : "border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
            title="Back to Subjects"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-800"}`}>
            {isEditing ? "Edit Subject" : "Add New Subject"}
          </h2>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            feedback.type === "success"
              ? isDark
                ? "bg-green-950/40 text-green-400 border-green-900/60"
                : "bg-green-50 text-green-600 border-green-200"
              : isDark
                ? "bg-red-950/40 text-red-400 border-red-900/60"
                : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`p-6 rounded-xl border shadow-sm space-y-5 transition-colors ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Subject Name *
          </label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            maxLength={255}
            placeholder="e.g. Mathematics"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Subject Code *{" "}
            <span className={`text-xs font-normal ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              (Must be unique)
            </span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="e.g. MATH101"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Subject Image{" "}
            <span className={`text-xs font-normal ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              (PNG, JPG, max 2MB)
            </span>
          </label>
          <div className="flex items-center gap-4 mt-2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-16 h-16 rounded-lg object-cover border shrink-0 ${
                  isDark ? "border-slate-700" : "border-gray-200"
                }`}
              />
            ) : (
              <div className={`w-16 h-16 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-gray-50 border-gray-200 text-gray-400"
              }`}>
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className={`w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                isDark
                  ? "text-slate-400 file:bg-blue-950/60 file:text-blue-400 hover:file:bg-blue-900/60"
                  : "text-gray-500 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              }`}
            />
          </div>
        </div>

        <div className={`flex justify-end gap-3 pt-4 border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
          <Link
            to="/admin/subjects"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={16} />
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Subject"
                : "Save Subject"}
          </button>
        </div>
      </form>
    </div>
  );
}