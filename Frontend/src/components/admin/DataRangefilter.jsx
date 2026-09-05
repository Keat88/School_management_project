function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="report-start" className="text-xs text-gray-500">
          From
        </label>
        <input
          id="report-start"
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700
            outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors w-full sm:w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="report-end" className="text-xs text-gray-500">
          To
        </label>
        <input
          id="report-end"
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700
            outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors w-full sm:w-44"
        />
      </div>
    </div>
  );
}

export default DateRangeFilter;