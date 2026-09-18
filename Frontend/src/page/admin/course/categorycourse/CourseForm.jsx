import { useState, useEffect } from "react";
import {
  BookOpen,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  Clock,
  Tag,
  FileText,
  Loader2,
  Upload,
  X,
  Link as LinkIcon,
} from "lucide-react";
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

  // Toggle between 'file' upload and 'url' string input
  const [thumbnailType, setThumbnailType] = useState("file");

  const activeCourse = course || fetchedCourse;
  const isEditMode = Boolean(activeCourse);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount_price: "",
    thumbnail: "", // Can be a File object or a string URL
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
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.get("/course-categories").catch((err) => {
        console.error("Failed to load categories:", err);
        return null;
      }),
      api.get("/teacher/index").catch((err) => {
        console.error("Failed to load instructors:", err);
        return null;
      }),
    ])
      .then(([catRes, instRes]) => {
        if (!isMounted) return;

        if (catRes && (catRes.data.status === "success" || catRes.data.status === true)) {
          const catData = catRes.data.data;
          setCategories(Array.isArray(catData) ? catData : catData.data || []);
        }

        if (instRes && (instRes.data.status === true || instRes.data.status === "success")) {
          const instData = instRes.data.data;
          setInstructors(Array.isArray(instData) ? instData : instData.data || []);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch course by URL param ID if no course prop was passed
  useEffect(() => {
    if (id && !course) {
      setLoadingCourse(true);
      api
        .get(`/course/show/${id}`)
        .then((res) => {
          if (res.data.status === "success" || res.data.status === true) {
            const courseData = res.data.data;
            setFetchedCourse(
              Array.isArray(courseData) ? courseData[0] : courseData,
            );
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
        has_certificate:
          activeCourse.has_certificate !== undefined
            ? Boolean(Number(activeCourse.has_certificate))
            : true,
        is_featured:
          activeCourse.is_featured !== undefined
            ? Boolean(Number(activeCourse.is_featured))
            : false,
        requirements: Array.isArray(activeCourse.requirements)
          ? activeCourse.requirements.join("\n")
          : activeCourse.requirements || "",
        what_you_will_learn: Array.isArray(activeCourse.what_you_will_learn)
          ? activeCourse.what_you_will_learn.join("\n")
          : activeCourse.what_you_will_learn || "",
      });

      // If existing thumbnail is a URL string, switch to URL mode automatically
      if (
        activeCourse.thumbnail &&
        typeof activeCourse.thumbnail === "string" &&
        activeCourse.thumbnail.startsWith("http")
      ) {
        setThumbnailType("url");
      }
    }
  }, [activeCourse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("thumbnail", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "requirements" || key === "what_you_will_learn") {
        const items = formData[key]
          ? formData[key].split("\n").filter(Boolean)
          : [];
        items.forEach((item, index) => {
          data.append(`${key}[${index}]`, item);
        });
      } else if (key === "thumbnail") {
        if (
          formData.thumbnail !== null &&
          formData.thumbnail !== undefined &&
          formData.thumbnail !== ""
        ) {
          data.append("thumbnail", formData.thumbnail);
        }
      } else if (key === "has_certificate" || key === "is_featured") {
        data.append(key, formData[key] ? 1 : 0);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    try {
      let response;
      const courseId = activeCourse?.id || id;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (courseId) {
        data.append("_method", "PUT");
        response = await api.post(`/course/update/${courseId}`, data, config);
      } else {
        response = await api.post("/course/store", data, config);
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
        setError(
          err.response?.data?.message ||
            (isEditMode
              ? "Failed to update course."
              : "Failed to create course."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 focus:border-blue-600 dark:focus:border-blue-500";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300";

  // Helper to determine thumbnail preview URL
  const getPreviewUrl = () => {
    if (!formData.thumbnail) return null;
    if (formData.thumbnail instanceof File) {
      return URL.createObjectURL(formData.thumbnail);
    }
    if (typeof formData.thumbnail === "string") {
      return formData.thumbnail;
    }
    return null;
  };

  if (loadingCourse) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2
          className="animate-spin text-blue-600 dark:text-blue-400"
          size={32}
        />
      </div>
    );
  }

  return (
    <div className="lg:min-w-160 mx-auto space-y-6 p-6 sm:p-8 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
        
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
              <BookOpen
                className="text-blue-600 dark:text-blue-400"
                size={22}
              />
              {isEditMode ? "Edit Course" : "Create New Course"}
            </h2>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {isEditMode
                ? "Update course details, pricing, and curriculum configurations."
                : "Fill out the information below to publish a brand new course."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium bg-red-50 dark:bg-rose-500/10 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-500/20 shadow-2xs">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 shadow-2xs">
          <CheckCircle size={16} className="shrink-0" />
          {isEditMode
            ? "Course updated successfully!"
            : "Course created successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: General Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
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
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Metrics */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
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
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
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

          {/* Thumbnail Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Thumbnail Image</label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailType("file");
                    if (typeof formData.thumbnail === "string") {
                      handleChange("thumbnail", "");
                    }
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    thumbnailType === "file"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailType("url");
                    handleChange("thumbnail", "");
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    thumbnailType === "url"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {thumbnailType === "file" ? (
                <label className="flex-1 w-full flex flex-col items-center justify-center px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-950/40 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                    <Upload className="w-8 h-8 mb-2 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      PNG, JPG, WEBP (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex-1 w-full">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon size={16} />
                    </span>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={
                        typeof formData.thumbnail === "string"
                          ? formData.thumbnail
                          : ""
                      }
                      onChange={(e) =>
                        handleChange("thumbnail", e.target.value)
                      }
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              )}

              {getPreviewUrl() && (
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-950 shadow-2xs">
                  <img
                    src={getPreviewUrl()}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleChange("thumbnail", "")}
                    className="absolute top-1 right-1 p-1 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition cursor-pointer"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.has_certificate}
                onChange={(e) =>
                  handleChange("has_certificate", e.target.checked)
                }
                className="w-4 h-4 rounded text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Offers Completion Certificate
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Feature on Homepage
              </span>
            </label>
          </div>
        </div>

        {/* Section 4: Content & Descriptions */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
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
              <label className={labelClass}>
                What You Will Learn (One per line)
              </label>
              <textarea
                rows="3"
                placeholder="Build full-stack web applications&#10;Master React hooks & state"
                value={formData.what_you_will_learn}
                onChange={(e) =>
                  handleChange("what_you_will_learn", e.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t flex items-center justify-end gap-3 border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onCancel || (() => navigate(-1))}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer disabled:opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Course"
                : "Save Course"}
          </button>
        </div>
      </form>
    </div>
  );
}