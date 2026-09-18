const statusStyles = {
  present:
    "bg-gray-50 text-blue-500 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60",
  absent:
    "bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/60",
  late:
    "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60",
};

const statusLabels = {
  present: "Present",
  absent: "Absent",
  late: "Late",
};

export default function AttendanceStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide transition-all ${
        statusStyles[status] ||
        "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}