import { Search, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

function StudentFilters({
  searchValue,
  onSearchChange,
  classFilter,
  onClassChange,
  genderFilter,
  onGenderChange,
  classOptions = [],
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm transition-colors">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-3 text-sm
            text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none
            focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/40
            transition-colors"
        />
      </div>

      {/* Class filter */}
      <select
        value={classFilter}
        onChange={(e) => onClassChange(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm text-gray-700 dark:text-slate-200
          outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/40
          transition-colors w-full md:w-44"
      >
        <option value="all">All Classes</option>
        {classOptions.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      {/* Gender filter */}
      <select
        value={genderFilter}
        onChange={(e) => onGenderChange(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm text-gray-700 dark:text-slate-200
          outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/40
          transition-colors w-full md:w-36"
      >
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {/* Add student */}
      <NavLink
        to={"/admin/students/add"}
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm
          font-medium px-4 py-2 transition-colors shrink-0"
      >
        <Plus size={16} />
        Add Student
      </NavLink>
    </div>
  );
}

export default StudentFilters;