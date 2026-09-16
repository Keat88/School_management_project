import { NavLink } from "react-router-dom";
import { Plus, Search, X, ChevronDown, RotateCcw } from "lucide-react";

export default function ClassFilter({
  searchValue = "",
  onSearchChange = () => {},
  gradeFilter = "all",
  onGradeChange = () => {},
  gradeOptions = [],
  sectionFilter = "all",
  onSectionChange = () => {},
  sectionOptions = [],
  classFilter = "all",
  onClassChange = () => {},
  classOptions = [],
  onResetFilters,
}) {
  const hasActiveFilters =
    searchValue !== "" ||
    gradeFilter !== "all" ||
    sectionFilter !== "all" ||
    classFilter !== "all";

  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onSearchChange("");
      onGradeChange("all");
      onSectionChange("all");
      onClassChange("all");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-gray-100 dark:border-slate-800 ">
      {/* Search & Select Filters */}
      <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-center gap-2.5">
        {/* Search Bar Input */}
        <div className="relative w-full sm:w-64 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search class or teacher..."
            className="w-full rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 pl-9 pr-8 py-2 text-xs font-medium text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all"
          />
          {searchValue && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Grade Dropdown */}
        <div className="relative w-full sm:w-36">
          <select
            value={gradeFilter}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all cursor-pointer"
          >
            <option value="all">All Grades</option>
            {Array.isArray(gradeOptions) &&
              gradeOptions.map((grade, idx) => {
                const val = grade?.id ?? grade?.value ?? grade;
                const label = grade?.name ?? grade?.label ?? `Grade ${grade}`;
                return (
                  <option key={grade?.id || `grade-${idx}`} value={val}>
                    {label}
                  </option>
                );
              })}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
          />
        </div>

        {/* Section Dropdown */}
        <div className="relative w-full sm:w-36">
          <select
            value={sectionFilter}
            onChange={(e) => onSectionChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all cursor-pointer"
          >
            <option value="all">All Sections</option>
            {Array.isArray(sectionOptions) &&
              sectionOptions.map((section, idx) => {
                const val = section?.id ?? section?.value ?? section;
                const label =
                  section?.name ?? section?.label ?? `Section ${section}`;
                return (
                  <option key={section?.id || `sec-${idx}`} value={val}>
                    {label}
                  </option>
                );
              })}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
          />
        </div>

        {/* Class Dropdown */}
        <div className="relative w-full sm:w-40">
          <select
            value={classFilter}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 py-2 pl-3 pr-8 text-xs font-medium text-gray-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all cursor-pointer"
          >
            <option value="all">All Classes</option>
            {Array.isArray(classOptions) &&
              classOptions.map((cls, idx) => {
                const val = cls?.id ?? cls?.value ?? cls;
                const label = cls?.name ?? cls?.label ?? cls;
                return (
                  <option key={cls?.id || `cls-${idx}`} value={val}>
                    {label}
                  </option>
                );
              })}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Add Class Action */}
      <NavLink
        to="/admin/classes/add"
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 transition-all duration-200 shadow-xs hover:shadow-md shrink-0 cursor-pointer"
      >
        <Plus size={15} />
        Add Class
      </NavLink>
    </div>
  );
}