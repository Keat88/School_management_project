function ActivityLogTable({ logs = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-5 pt-5">
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">
          Recent Activity Logs
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/50">
              <th className="px-5 py-3 font-medium text-gray-500 dark:text-slate-400">User</th>
              <th className="px-5 py-3 font-medium text-gray-500 dark:text-slate-400">Action</th>
              <th className="px-5 py-3 font-medium text-gray-500 dark:text-slate-400">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-10 text-center text-sm text-gray-400 dark:text-slate-500"
                >
                  No activity recorded for this range.
                </td>
              </tr>
            )}

            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-100 dark:border-slate-800/60 last:border-0 hover:bg-gray-50/60 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-gray-800 dark:text-slate-200 whitespace-nowrap">
                  {log.user}
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-slate-300">{log.action}</td>
                <td className="px-5 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">
                  {log.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityLogTable;