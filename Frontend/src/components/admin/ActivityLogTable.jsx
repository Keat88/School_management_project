function ActivityLogTable({ logs = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-5 pt-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Recent Activity Logs
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="px-5 py-3 font-medium text-gray-500">User</th>
              <th className="px-5 py-3 font-medium text-gray-500">Action</th>
              <th className="px-5 py-3 font-medium text-gray-500">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-10 text-center text-sm text-gray-400"
                >
                  No activity recorded for this range.
                </td>
              </tr>
            )}

            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {log.user}
                </td>
                <td className="px-5 py-3 text-gray-600">{log.action}</td>
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
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