import { Search, Plus } from "lucide-react";

const audienceOptions = [
  { value: "all", label: "All Audiences" },
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
];

function NoticeFilters({
  searchValue,
  onSearchChange,
  audienceFilter,
  onAudienceChange,
  onCreateNotice,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm
            text-slate-800 placeholder-slate-400 outline-none
            focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100
            transition-all duration-200"
        />
      </div>

      {/* Audience Filter Select */}
      <select
        value={audienceFilter}
        onChange={(e) => onAudienceChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-sm text-slate-700
          outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100
          transition-all duration-200 w-full md:w-44 font-medium"
      >
        {audienceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Create Button */}
      <button
        type="button"
        onClick={onCreateNotice}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs shrink-0"
      >
        <Plus size={16} />
        Create Notice
      </button>
    </div>
  );
}

export default NoticeFilters;