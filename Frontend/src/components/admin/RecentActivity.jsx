function RecentActivity({ activities = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      <ul className="space-y-4">
        {activities.length === 0 && (
          <li className="text-sm text-gray-400">No recent activity.</li>
        )}
        {activities.map((activity) => (
          <li key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
              <span className="w-px flex-1 bg-gray-100" />
            </div>
            <div className="pb-1 min-w-0">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-800">
                  {activity.actor}
                </span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivity;