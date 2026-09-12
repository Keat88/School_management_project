import { useState, useEffect } from "react";
import { BookOpen, Save, AlertCircle, CheckCircle, ArrowLeft, DollarSign, Clock, Tag, FileText } from "lucide-react";
import { api } from "../../../../data/api";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseForm({ course = null, onSuccess, onCancel }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [fetchedCourse, setFetchedCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const activeCourse = course || fetchedCourse;
  const isEditMode = Boolean(activeCourse);

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

  // Fetch categories and instructors
  useEffect(() => {
    api.get("/course-categories")
      .then((res) => {
        if (res.data.status === "success" || res.data.status === true) {
          const catData = res.data.data;
          setCategories(Array.isArray(catData) ? catData : catData.data || []);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));

    api.get("/teacher/index")
      .then((res) => {
        // Updated to handle boolean status (true) matching your API response
        if (res.data.status === true || res.data.status === "success") {
          const data = res.data.data;
          setInstructors(Array.isArray(data) ? data : data.data || []);
        }
      })
      .catch((err) => console.error("Failed to load instructors:", err));
  }, []);

  // Fetch course by URL param ID if no course prop was passed
  useEffect(() => {
    if (id && !course) {
      setLoadingCourse(true);
      api.get(`/courses/${id}`)
        .then((res) => {
          if (res.data.status === "success" || res.data.status === true) {
            setFetchedCourse(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load course:", err);
          setError("Failed to load course details for editing.");
        })
        .finally(() => setLoadingCourse(false));
    }
  }, [id, course]);

  // Populate form data when activeCourse is available
  useEffect(() => {
    if (activeCourse) {
      setFormData({
        title: activeCourse.title || "",
        description: activeCourse.description || "",
        price: activeCourse.price ?? "",
        discount_price: activeCourse.discount_price ?? "",
        thumbnail: activeCourse.thumbnail || "",
        category_id: activeCourse.category_id || "",
        instructor_id: activeCourse.instructor_id || "",
        level: activeCourse.level || "beginner",
        status: activeCourse.status || "draft",
        duration: activeCourse.duration || "",
        lessons_count: activeCourse.lessons_count ?? "",
        language: activeCourse.language || "English",
        has_certificate: activeCourse.has_certificate ?? true,
        is_featured: activeCourse.is_featured ?? false,
        requirements: Array.isArray(activeCourse.requirements) 
          ? activeCourse.requirements.join("\n") 
          : (activeCourse.requirements || ""),
        what_you_will_learn: Array.isArray(activeCourse.what_you_will_learn) 
          ? activeCourse.what_you_will_learn.join("\n") 
          : (activeCourse.what_you_will_learn || ""),
      });
    }
  }, [activeCourse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...formData,
      requirements: formData.requirements ? formData.requirements.split("\n").filter(Boolean) : [],
      what_you_will_learn: formData.what_you_will_learn ? formData.what_you_will_learn.split("\n").filter(Boolean) : [],
    };

    try {
      let response;
      const courseId = activeCourse?.id || id;

      if (courseId) {
        response = await api.put(`/courses/${courseId}`, payload);
      } else {
        response = await api.post("/courses", payload);
      }

      if (response.data.status === "success" || response.data.status === true) {
        setSuccess(true);
        if (onSuccess) onSuccess(response.data.data);
        setTimeout(() => {
          setSuccess(false);
          if (!onSuccess) navigate(-1);
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || (isEditMode ? "Failed to update course." : "Failed to create course."));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-500/30 focus:border-blue-600 dark:focus:border-indigo-500";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300";

  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-slate-500 dark:text-slate-400">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:min-w-160 mx-auto p-6 sm:p-8 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onCancel || (() => navigate(-1))}
            className="p-2.5 rounded-xl border transition-colors cursor-pointer border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
              <BookOpen className="text-blue-600 dark:text-indigo-400" size={22} />
              {isEditMode ? "Edit Course" : "Create New Course"}
            </h2>
            <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
              {isEditMode 
                ? "Update course details, pricing, and curriculum configurations." 
                : "Fill out the information below to publish a brand new course."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium bg-red-50 dark:bg-rose-500/10 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-500/20">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
          <CheckCircle size={16} className="shrink-0" />
          {isEditMode ? "Course updated successfully!" : "Course created successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-indigo-400 flex items-center gap-2">
            <FileText size={16} /> General Information
          </h3>
          
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
        </div>

        {/* Section 2: Pricing & Metrics */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-indigo-400 flex items-center gap-2">
            <DollarSign size={16} /> Pricing & Course Metrics
          </h3>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>
        </div>

        {/* Section 3: Configuration & Media */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-indigo-400 flex items-center gap-2">
            <Tag size={16} /> Status & Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className={labelClass}>Publication Status</label>
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

          <div>
            <label className={labelClass}>Thumbnail Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnail}
              onChange={(e) => handleChange("thumbnail", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.has_certificate}
                onChange={(e) => handleChange("has_certificate", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 dark:text-indigo-500 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Offers Completion Certificate
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 dark:text-indigo-500 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Feature on Homepage
              </span>
            </label>
          </div>
        </div>

        {/* Section 4: Content & Descriptions */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-indigo-400 flex items-center gap-2">
            <Clock size={16} /> Course Syllabus & Details
          </h3>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows="4"
              placeholder="Write a comprehensive description of what students will experience..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className={labelClass}>What You Will Learn (One per line)</label>
              <textarea
                rows="3"
                placeholder="Build full-stack web applications&#10;Master React hooks & state"
                value={formData.what_you_will_learn}
                onChange={(e) => handleChange("what_you_will_learn", e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t flex items-center justify-end gap-3 border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onCancel || (() => navigate(-1))}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditMode ? "Update Course" : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
}