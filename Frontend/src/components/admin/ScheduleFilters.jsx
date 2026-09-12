import { Plus } from "lucide-react";

function ScheduleFilters({
  classFilter,
  onClassChange,
  dayFilter,
  onDayChange,
  classOptions,
  dayOptions,
  onAddSchedule,
  onManySchedule,
}) {
  const selectClass =
    "rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm text-gray-700 dark:text-slate-200 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <select
        value={classFilter}
        onChange={(e) => onClassChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">All Classes</option>
        {classOptions.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <select
        value={dayFilter}
        onChange={(e) => onDayChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">All Days</option>
        {dayOptions.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onAddSchedule}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-500 active:bg-blue-800 transition-colors shrink-0"
      >
        <Plus size={16} />
        Add Schedule
      </button>
      <button
        type="button"
        onClick={onManySchedule}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-500 active:bg-blue-800 transition-colors shrink-0"
      >
        <Plus size={16} />
        Many Create
      </button>
    </div>
  );
}

export default ScheduleFilters;