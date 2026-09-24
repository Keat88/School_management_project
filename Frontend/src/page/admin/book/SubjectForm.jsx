import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Image as ImageIcon, Save } from "lucide-react";
import { subjectApi } from "../../../data/classrooms";
import { colorbtn, colorform } from "../../../data/datafeature";

export default function SubjectForm({ isDark: propIsDark = false }) {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme") || localStorage.getItem("darkMode");
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

  // Sync with localStorage changes across components/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme =
        localStorage.getItem("theme") || localStorage.getItem("darkMode");
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
          console.error("Error fetching subject:", error);
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
      if (isEditing) {
        await subjectApi.upDate(formData, id);
      } else {
        await subjectApi.addNew(formData);
      }

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
      console.error("Error saving subject:", error);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`lg:min-w-160 mx-auto space-y-6 transition-colors ${
        isDark ? "text-slate-100" : "text-slate-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between pb-4 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <h2
            className={`text-lg font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {isEditing ? "Edit Subject" : "Add New Subject"}
          </h2>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border shadow-sm ${
            feedback.type === "success"
              ? isDark
                ? "bg-green-950/40 text-green-400 border-green-900/60"
                : "bg-green-50 text-green-700 border-green-200"
              : isDark
                ? "bg-red-950/40 text-red-400 border-red-900/60"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-6 sm:p-8 rounded-xl border shadow-xs space-y-6 transition-colors ${
          isDark
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div>
          <label className={colorform.color_label}>Subject Name *</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            maxLength={255}
            placeholder="e.g. Mathematics"
            className={colorform.color_input}
          />
        </div>

        <div>
          <label className={colorform.color_label}>
            Subject Code *{" "}
            <span
              className={`text-xs font-normal lowercase ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              (must be unique)
            </span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="e.g. MATH101"
            className={`${colorform.color_input} font-mono`}
          />
        </div>

        <div>
          <label className={colorform.color_label}>
            Subject Image{" "}
            <span
              className={`text-xs font-normal lowercase ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              (PNG, JPG, max 2MB)
            </span>
          </label>
          <div className="flex items-center gap-4 mt-2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-16 h-16 rounded-xl object-cover border shrink-0 shadow-sm ${
                  isDark ? "border-slate-700" : "border-slate-200"
                }`}
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-xl border flex items-center justify-center shrink-0 ${
                  isDark
                    ? "bg-slate-950 border-slate-700 text-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className={`w-full text-sm cursor-pointer file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold transition-all ${
                isDark
                  ? "text-slate-400 file:bg-blue-950/60 file:text-blue-400 hover:file:bg-blue-900/60"
                  : "text-slate-500 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              }`}
            />
          </div>
        </div>

        <div
          className={`flex items-center justify-end gap-3 pt-5 border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <Link to="/admin/subjects" className={colorbtn.btncancel}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={colorbtn.btnsave}>
            <Save size={15} />
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
