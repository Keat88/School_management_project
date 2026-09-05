import AttendanceStatusBadge from "./Attendancestatusbadge";

function initials(name = "") {
  return name.charAt(0).toUpperCase();
}

function AttendanceTable({ records = [], onUnlock, onTakeAttendance, onViewMessage }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-4 py-3 font-medium text-gray-500">Student</th>
              <th className="px-4 py-3 font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Check-in</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  No attendance records match your filters.
                </td>
              </tr>
            )}

            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {initials(record.studentName)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 whitespace-nowrap block">
                        {record.studentName}
                      </span>
                      {record.absenceCount > 3 && (
                        <span className="text-[10px] text-rose-500 font-medium">
                          {record.absenceCount} consecutive absences
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {record.class}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {record.date}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {record.checkInTime || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <AttendanceStatusBadge status={record.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Message / Excuse Note Action Button */}
                    <button
                      type="button"
                      onClick={() => onViewMessage && onViewMessage(record)}
                      className={`relative p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        record.hasUnreadMessage
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                      title={record.hasUnreadMessage ? "New message/excuse from student" : "View student attendance message"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {record.hasUnreadMessage && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                      )}
                    </button>

                    {/* Mark / Update Attendance */}
                    <button
                      type="button"
                      onClick={() => onTakeAttendance && onTakeAttendance(record)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                      title="Record or update attendance"
                    >
                      Mark
                    </button>

                    {/* Admin Unlock or Active status */}
                    {record.isLocked ? (
                      <button
                        type="button"
                        onClick={() => onUnlock && onUnlock(record)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shadow-sm cursor-pointer animate-pulse"
                        title="Auto-locked due to repeated absences. Admin unlock required."
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Unlock
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
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