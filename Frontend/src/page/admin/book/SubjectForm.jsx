import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Save } from "lucide-react";
import { api } from "../../../data/api";
import { subjectApi } from "../../../data/classrooms";

export default function SubjectForm() {
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
        navigate("/subjects");
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
      <div className="max-w-2xl mx-auto py-12 text-center text-gray-400 text-sm">
        Loading subject details...
      </div>
    );
  }

  return (
    <div className="min-w-160 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/subjects"
            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Back to Subjects"
          >
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Subject" : "Add New Subject"}
          </h2>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name *
          </label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            maxLength={255}
            placeholder="e.g. Mathematics"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Code *{" "}
            <span className="text-xs text-gray-400 font-normal">
              (Must be unique)
            </span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="e.g. MATH101"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Image{" "}
            <span className="text-xs text-gray-400 font-normal">
              (PNG, JPG, max 2MB)
            </span>
          </label>
          <div className="flex items-center gap-4 mt-2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                <ImageIcon size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to="/subjects"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
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
