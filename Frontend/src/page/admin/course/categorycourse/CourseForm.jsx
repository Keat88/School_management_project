import { useState, useEffect } from "react";
import { BookOpen, Save, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { api } from "../../../../data/api";
import { useNavigate } from "react-router-dom";

export default function CourseForm({ isDark = false, course = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount_price: "",
    thumbnail: "",
    category_id: "",
    instructor_id: "",
    level: "beginner",
    status: "draft",
    duration: "",
    lessons_count: "",
    language: "English",
    has_certificate: true,
    is_featured: false,
    requirements: "",
    what_you_will_learn: "",
  });

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/course-categories")
      .then((res) => {
        if (res.data.status === "success") {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));

    api.get("/users")
      .then((res) => {
        if (res.data.status === "success") {
          const data = res.data.data;
          setInstructors(Array.isArray(data) ? data : data.data || []);
        }
      })
      .catch((err) => console.error("Failed to load instructors:", err));

    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price ?? "",
        discount_price: course.discount_price ?? "",
        thumbnail: course.thumbnail || "",
        category_id: course.category_id || "",
        instructor_id: course.instructor_id || "",
        level: course.level || "beginner",
        status: course.status || "draft",
        duration: course.duration || "",
        lessons_count: course.lessons_count ?? "",
        language: course.language || "English",
        has_certificate: course.has_certificate ?? true,
        is_featured: course.is_featured ?? false,
        requirements: Array.isArray(course.requirements) ? course.requirements.join("\n") : (course.requirements || ""),
        what_you_will_learn: Array.isArray(course.what_you_will_learn) ? course.what_you_will_learn.join("\n") : (course.what_you_will_learn || ""),
      });
    }
  }, [course]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Format textareas into arrays for backend JSON columns
    const payload = {
      ...formData,
      requirements: formData.requirements ? formData.requirements.split("\n").filter(Boolean) : [],
      what_you_will_learn: formData.what_you_will_learn ? formData.what_you_will_learn.split("\n").filter(Boolean) : [],
    };

    try {
      let response;
      if (course) {
        response = await api.put(`/courses/${course.id}`, payload);
      } else {
        response = await api.post("/courses", payload);
      }

      if (response.data.status === "success") {
        setSuccess(true);
        if (onSuccess) onSuccess(response.data.data);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Failed to save course.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
    isDark 
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-blue-900 focus:border-blue-500" 
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-100 focus:border-blue-600"
  }`;

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1 ${
    isDark ? "text-slate-300" : "text-slate-700"
  }`;

  return (
    <div className={`space-y-6 lg:min-w-160 mx-auto p-6 rounded-2xl border shadow-xs ${
      isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel || (() => navigate(-1))}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              <BookOpen className="text-blue-600" size={22} />
              {course ? "Edit Course" : "Create New Course"}
            </h2>
            <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {course ? "Update course details and configurations." : "Fill out the information below to publish a new course."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
          isDark ? "bg-red-950/50 text-red-400 border-red-900/60" : "bg-red-50 text-red-700 border-red-200"
        }`}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${
          isDark ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/60" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          <CheckCircle size={16} />
          {course ? "Course updated successfully!" : "Course created successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className={labelClass}>Course Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Advanced React & Next.js Masterclass"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Category & Instructor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Instructor *</label>
            <select
              required
              value={formData.instructor_id}
              onChange={(e) => handleChange("instructor_id", e.target.value)}
              className={inputClass}
            >
              <option value="">Select Instructor</option>
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Discount Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="99.99"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Discount Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="49.99"
              value={formData.discount_price}
              onChange={(e) => handleChange("discount_price", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Duration & Lessons Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Duration</label>
            <input
              type="text"
              placeholder="e.g. 12.5 total hours"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Lessons Count</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 45"
              value={formData.lessons_count}
              onChange={(e) => handleChange("lessons_count", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Level, Language & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Level</label>
            <select
              value={formData.level}
              onChange={(e) => handleChange("level", e.target.value)}
              className={inputClass}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all">All Levels</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Language</label>
            <input
              type="text"
              placeholder="e.g. English"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Checkboxes / Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.has_certificate}
              onChange={(e) => handleChange("has_certificate", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Offers Completion Certificate
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => handleChange("is_featured", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Feature on Homepage
            </span>
          </label>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className={labelClass}>Thumbnail URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={formData.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows="3"
            placeholder="Write a comprehensive description..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Requirements */}
        <div>
          <label className={labelClass}>Requirements (One per line)</label>
          <textarea
            rows="3"
            placeholder="Basic JavaScript knowledge&#10;A computer with internet access"
            value={formData.requirements}
            onChange={(e) => handleChange("requirements", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* What You Will Learn */}
        <div>
          <label className={labelClass}>What You Will Learn (One per line)</label>
          <textarea
            rows="3"
            placeholder="Build full-stack web applications&#10;Master React hooks and state management"
            value={formData.what_you_will_learn}
            onChange={(e) => handleChange("what_you_will_learn", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Footer Actions */}
        <div className={`pt-4 border-t flex items-center justify-end gap-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          <button
            type="button"
            onClick={onCancel || (() => navigate(-1))}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
              isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving..." : course ? "Update Course" : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
}