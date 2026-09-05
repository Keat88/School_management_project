function AttendanceOverview({ overallRate, byClass = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Attendance Overview
        </h3>
        <span className="text-sm font-medium text-blue-600">
          {overallRate}% today
        </span>
      </div>

      <div className="space-y-4">
        {byClass.map((item) => (
          <div key={item.className}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{item.className}</span>
              <span className="text-sm font-medium text-gray-800">
                {item.rate}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${item.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceOverview;