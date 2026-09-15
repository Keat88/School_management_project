function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="report-start" className="text-xs font-medium text-slate-500 dark:text-slate-400">
          From
        </label>
        <input
          id="report-start"
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 px-3 text-sm text-slate-900 dark:text-slate-100
            outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20
            transition-colors w-full sm:w-44 cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="report-end" className="text-xs font-medium text-slate-500 dark:text-slate-400">
          To
        </label>
        <input
          id="report-end"
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 px-3 text-sm text-slate-900 dark:text-slate-100
            outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/20
            transition-colors w-full sm:w-44 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default DateRangeFilter;