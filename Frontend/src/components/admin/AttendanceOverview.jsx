export default function AttendanceOverview({ overallRate, byClass = [] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Attendance Overview
        </h3>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg uppercase tracking-wider">
          {overallRate}% today
        </span>
      </div>

      <div className="space-y-4">
        {byClass.map((item) => (
          <div key={item.className}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {item.className}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {item.rate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                style={{ width: `${item.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}