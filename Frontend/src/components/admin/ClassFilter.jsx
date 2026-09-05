import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";

export default function ClassFilter({ classFilter, onClassChange, classOptions = [] }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <select
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors w-full md:w-44"
        >
          <option value="all">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls.id || cls} value={cls.id || cls}>
              {cls.name || cls}
            </option>
          ))}
        </select>
      </div>
      <NavLink
        to="/classes/add"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
      >
        <Plus size={16} />
        Add Class
      </NavLink>
    </div>
  );
}