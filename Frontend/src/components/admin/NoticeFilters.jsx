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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notices..."
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-2 pl-9 pr-3 text-sm
            text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none
            focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20
            transition-all duration-200"
        />
      </div>

      {/* Audience Filter Select */}
      <select
        value={audienceFilter}
        onChange={(e) => onAudienceChange(e.target.value)}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-2 px-3 text-sm text-slate-700 dark:text-slate-300
          outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20
          transition-all duration-200 w-full md:w-44 font-medium cursor-pointer"
      >
        {audienceOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Create Button */}
      <button
        type="button"
        onClick={onCreateNotice}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-500 active:bg-blue-800 transition-colors shadow-xs shrink-0 cursor-pointer active:scale-95"
      >
        <Plus size={16} />
        Create Notice
      </button>
    </div>
  );
}

export default NoticeFilters;
