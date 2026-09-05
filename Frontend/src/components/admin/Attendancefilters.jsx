function AttendanceFilters({
  dateValue,
  onDateChange,
  classFilter,
  onClassChange,
  classOptions = []
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="attendance-date" className="text-xs text-gray-500">
          Date
        </label>
        <input
          id="attendance-date"
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700
            outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors w-full sm:w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="attendance-class" className="text-xs text-gray-500">
          Class
        </label>
        <select
          id="attendance-class"
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700
            outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors w-full sm:w-48"
        >
          <option value="all">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AttendanceFilters;