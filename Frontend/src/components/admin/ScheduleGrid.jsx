import { days } from "../../data/schedules";

function ScheduleGrid({ classes, schedulesByClass, emptyMessage }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] font-poppins text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/80">
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400 sticky left-0 bg-gray-50 dark:bg-slate-900 text-left min-w-[150px]">
                Class
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400 text-center min-w-[160px]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr>
                <td
                  colSpan={days.length + 1}
                  className="px-4 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {classes.map((cls) => (
              <tr
                key={cls}
                className="border-b border-gray-100 dark:border-slate-800/60 last:border-0 align-top"
              >
                <td className="px-4 py-3 sticky left-0 bg-white dark:bg-slate-900">
                  <div className="font-semibold text-gray-800 dark:text-slate-200 whitespace-nowrap">
                    {cls}
                  </div>
                </td>
                {days.map((day) => {
                  const dayEntries = (schedulesByClass[cls]?.[day] || []).sort(
                    (a, b) => a.start_time.localeCompare(b.start_time),
                  );
                  return (
                    <td key={day} className="px-3 py-3">
                      {dayEntries.length === 0 ? (
                        <div className="text-center text-gray-300 dark:text-slate-600 text-xs py-3">
                          —
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="rounded-lg border border-gray-200 dark:border-slate-800 dark:bg-slate-800/40 px-3 py-2 group hover:shadow-sm hover:-translate-y-0.5 duration-200 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold font-roboto text-slate-800 dark:text-slate-200 group-hover:text-slate-600 dark:group-hover:text-white text-xs">
                                  {entry.subject}
                                </span>
                              </div>
                              <div className="mt-0.5 text-gray-600 dark:text-slate-400 text-xs">
                                {entry.teacher}
                              </div>
                              <div className="text-gray-400 dark:text-slate-500 text-xs">
                                {entry.start_time?.slice(0, 5)} –{" "}
                                {entry.end_time?.slice(0, 5)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleGrid;