const statusStyles = {
  present: "bg-blue-50  text-blue-800",
  absent: "bg-red-50 text-red-800",
  late: "bg-gray-50 text-gray-800"
};

const statusLabels = {
  present: "Present",
  absent: "Absent",
  late: "Late"
};

function AttendanceStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

export default AttendanceStatusBadge;