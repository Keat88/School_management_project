import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, Star, BookOpen } from "lucide-react";
import { api } from "../../../data/api";
import Pagination from "../../../hooks/Pagination";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([{ id: "All", name: "All" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to page 1 when filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/public/category");
        const resData = response.data;
        const categoryList = Array.isArray(resData.data)
          ? resData.data
          : Array.isArray(resData)
          ? resData
          : [];

        const formattedCategories = categoryList.map((cat) => ({
          id: cat.id,
          name: cat.name || cat,
        }));

        setCategories([{ id: "All", name: "All" }, ...formattedCategories]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Courses with Backend Filtering & Pagination
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage };
        if (selectedCategory !== "All") {
          params.category_id = selectedCategory;
        }
        if (searchQuery.trim() !== "") {
          params.search = searchQuery;
        }

        const response = await api.get("/public/courses", { params });
        const resData = response.data;

        // Handle Laravel pagination structure (resData.data for items, current_page, last_page)
        const courseList = Array.isArray(resData.data)
          ? resData.data
          : Array.isArray(resData)
          ? resData
          : resData.data?.data || [];

        setCourses(courseList);
        setCurrentPage(resData.current_page || resData.meta?.current_page || currentPage);
        setTotalPages(resData.last_page || resData.meta?.last_page || 1);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses from server.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery, currentPage]);

  // Client-side price filter
  const filteredCourses = courses.filter((course) => {
    const isCourseFree = Number(course.price) === 0 || course.is_free;
    if (selectedPrice === "Free") return isCourseFree;
    if (selectedPrice === "Paid") return !isCourseFree;
    return true;
  });

  return (
    <div className="bg-gray-50/50 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50">
            Our Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore All Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Discover professional online courses to elevate your skills and
            advance your career path.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free Courses</option>
              <option value="Paid">Paid Courses</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-xs cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600 dark:bg-indigo-600 text-white shadow-blue-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2
              className="animate-spin text-blue-600 dark:text-indigo-400"
              size={36}
            />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-xl mx-auto p-4 bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/20 text-red-700 dark:text-rose-400 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => {
                const categoryName =
                  typeof course.category === "object"
                    ? course.category?.name
                    : course.category;
                const instructorName =
                  typeof course.instructor === "object"
                    ? course.instructor?.name
                    : course.instructor;
                const instructorAvatar =
                  typeof course.instructor === "object"
                    ? course.instructor?.avatar
                    : course.avatar;
                const isFree = Number(course.price) === 0 || course.is_free;

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 duration-200 group"
                  >
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.thumbnail || course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      {categoryName && (
                        <span className="absolute top-3 left-3 bg-blue-600 dark:bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                          {categoryName}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {course.title}
                        </h3>

                        {instructorName && (
                          <div className="flex items-center space-x-2">
                            {instructorAvatar && (
                              <img
                                src={instructorAvatar}
                                alt={instructorName}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            )}
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {instructorName}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1.5 pt-1">
                          <div className="flex text-amber-400">
                            <Star size={14} fill="currentColor" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {course.rating || "4.8"}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            ({course.reviews_count || course.reviewsCount || "0"})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-baseline space-x-2">
                          {isFree ? (
                            <span className="text-base font-bold text-blue-600 dark:text-indigo-400">
                              Free
                            </span>
                          ) : (
                            <>
                              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                ${course.discount_price || course.price}
                              </span>
                              {course.original_price && (
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 line-through">
                                  ${course.original_price}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <Link
                          to={`/courses/${course.id}`}
                          className="bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 hover:bg-blue-600 dark:hover:bg-indigo-600 hover:text-white font-medium text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="pt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="w-12 h-12 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No courses found
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-400">
              Try adjusting your search query or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}