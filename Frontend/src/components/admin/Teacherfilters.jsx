import { Search, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
function TeacherFilters({ searchValue, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search teachers by name, code, or subject..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm
            text-gray-700 placeholder-gray-400 outline-none
            focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors"
        />
      </div>

      <NavLink
        type="button"
        to={'/teacher/add'}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
      >
        <Plus size={16} />
        Add Teacher
      </NavLink>
    </div>
  );
}

export default TeacherFilters;