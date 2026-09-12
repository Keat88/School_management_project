import AttendanceStatusBadge from "./Attendancestatusbadge";

function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function AttendanceTable({ records = [], onUnlock, onTakeAttendance, onViewMessage }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-sm text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/40">
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Student</th>
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Class</th>
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Date</th>
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Check-in</th>
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
              <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500 font-medium">
                  No attendance records match your filters.
                </td>
              </tr>
            )}

            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                      {initials(record.studentName)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap block">
                        {record.studentName}
                      </span>
                      {record.absenceCount > 3 && (
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5 block">
                          {record.absenceCount} consecutive absences
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                  {record.class}
                </td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                  {record.date}
                </td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                  {record.checkInTime || "—"}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <AttendanceStatusBadge status={record.status} />
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Message / Excuse Note Action Button */}
                    <button
                      type="button"
                      onClick={() => onViewMessage && onViewMessage(record)}
                      className={`relative p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        record.hasUnreadMessage
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                      }`}
                      title={record.hasUnreadMessage ? "New message/excuse from student" : "View student attendance message"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {record.hasUnreadMessage && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900"></span>
                      )}
                    </button>

                    {/* Mark / Update Attendance */}
                    <button
                      type="button"
                      onClick={() => onTakeAttendance && onTakeAttendance(record)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900 transition-all border border-blue-200 cursor-pointer shadow-sm"
                      title="Record or update attendance"
                    >
                      Mark
                    </button>

                    {/* Admin Unlock or Active status */}
                    {record.isLocked ? (
                      <button
                        type="button"
                        onClick={() => onUnlock && onUnlock(record)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-900 transition-all shadow-sm cursor-pointer animate-pulse"
                        title="Auto-locked due to repeated absences. Admin unlock required."
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Unlock
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Active
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;