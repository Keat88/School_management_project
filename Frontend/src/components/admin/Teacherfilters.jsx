import { Search, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

function TeacherFilters({
  searchValue,
  genderValue = "",
  onSearchChange,
  onGenderChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-200 dark:border-slate-800  dark:bg-slate-900 p-2 rounded-xl transition-colors">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teachers by name, code, or subject..."
          className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 pl-9 pr-3 text-sm
            text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 outline-none
            focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/40
            transition-colors"
        />
      </div>
      <div className="flex gap-1 justify-end">
        {/* Gender Filter Dropdown */}
        <select
          value={genderValue}
          onChange={(e) => onGenderChange(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm text-gray-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-indigo-950/40 transition-colors"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Add Teacher Button */}
        <NavLink
          to="/admin/teacher/add"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
        >
          <Plus size={16} />
          Add Teacher
        </NavLink>
      </div>
    </div>
  );
}

export default TeacherFilters;
