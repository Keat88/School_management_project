import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../../../data/api";
import { ArrowLeft, Edit, Loader2, Star, Award } from "lucide-react";

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/course/show/${id}`);
        const resData = response.data;
        const courseData = resData.data;

        setCourse(Array.isArray(courseData) ? courseData[0] : courseData);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2
          className="animate-spin text-blue-600 dark:text-indigo-400"
          size={32}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-4 bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-red-700 dark:text-rose-400 rounded-xl text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!course) return null;

  // Defensive array normalizers in case API returns strings or null
  const whatYouWillLearn = Array.isArray(course.what_you_will_learn)
    ? course.what_you_will_learn
    : [];
  const requirements = Array.isArray(course.requirements)
    ? course.requirements
    : [];

  return (
    <div className="space-y-6 lg:min-w-160 mx-auto p-6 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <Link
          to={`/admin/course/add/${course.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 dark:hover:bg-indigo-500 transition shadow-xs"
        >
          <Edit size={16} /> Edit Course
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        {/* Thumbnail Banner */}
        {course.thumbnail && (
          <div className="w-full h-64 sm:h-80 overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Badges & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-indigo-950/80 text-blue-700 dark:text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider border border-blue-100 dark:border-indigo-900/50">
                {course.category?.name || "Category"}
              </span>
              <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                {course.level}
              </span>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider border ${
                  course.status === "published"
                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50"
                    : "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/50"
                }`}
              >
                {course.status}
              </span>
              {course.is_featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
                  <Star size={12} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {course.title}
            </h1>
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">
              Slug: {course.slug}
            </p>
          </div>

          {/* Pricing & Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 text-sm">
            <div>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Price
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-slate-900 dark:text-slate-100 font-bold text-base">
                  ${course.discount_price || course.price}
                </span>
                {course.discount_price && (
                  <span className="text-slate-400 dark:text-slate-500 text-xs line-through">
                    ${course.price}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Duration
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold mt-1 block">
                {course.duration || "N/A"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Lessons
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold mt-1 block">
                {course.lessons_count ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Language
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold mt-1 block">
                {course.language || "English"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
              {course.description || "No description provided."}
            </p>
          </div>

          {/* What you will learn & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            {whatYouWillLearn.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  What You Will Learn
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2.5">
                      <span className="text-blue-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">
                        &#10003;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2.5">
                      <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0 mt-0.5">
                        &bull;
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Instructor & Certificate Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-sm">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Instructor
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold mt-1 block">
                {course.instructor?.name || "N/A"}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                {course.instructor?.email}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                Certificate Status
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold mt-1 block flex items-center gap-1.5">
                <Award
                  size={16}
                  className="text-blue-600 dark:text-indigo-400"
                />
                {course.has_certificate
                  ? "Completion Certificate Available"
                  : "No Certificate"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
