export default function AttendanceFilters({
  dateValue,
  onDateChange,
  classFilter,
  onClassChange,
  classOptions = [],
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Date Filter */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="attendance-date"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
        >
          Date
        </label>
        <input
          id="attendance-date"
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 
            outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 
            dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 
            dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-blue-950
            transition-all w-full sm:w-44"
        />
      </div>

      {/* Class / Grade Filter */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="attendance-class"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
        >
          Class
        </label>
        <select
          id="attendance-class"
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 
            outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 
            dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 
            dark:focus:bg-slate-900 dark:focus:border-blue-500 dark:focus:ring-blue-950
            transition-all w-full sm:w-48"
        >
          <option
            value="all"
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            All Classes
          </option>
          {classOptions.map((cls) => (
            <option
              key={cls.id}
              value={cls.grade} // 💡 ប្រើតម្លៃ grade ឱ្យត្រូវជាមួយ Backend parameter
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              Grade {cls.grade} - Section {cls.section} {/* 💡 បង្ហាញជា String ច្បាស់លាស់ */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}