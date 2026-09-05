import { Plus } from "lucide-react";

function ScheduleFilters({
  classFilter,
  onClassChange,
  dayFilter,
  onDayChange,
  classOptions,
  dayOptions,
  onAddSchedule,
}) {
  const selectClass =
    "rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors";

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
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm
          font-medium px-4 py-2 hover:bg-blue-700 active:bg-blue-800 transition-colors shrink-0"
      >
        <Plus size={16} />
        Add Schedule
      </button>
    </div> 
  );
}

export default ScheduleFilters;
