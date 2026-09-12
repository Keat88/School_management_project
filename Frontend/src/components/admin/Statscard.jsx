import {
  Users,
  GraduationCap,
  DoorOpen,
  Hotel,
  CalendarCheck,
  BookMarked,
  BookOpen,
  FileCheck2,
} from "lucide-react";

const accentStyles = {
  blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60",
  orange: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/60",
  purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/60",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/60",
  rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-900/60",
  teal: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-900/60",
};

export function StatCard({ label, value, icon: Icon, accent = "blue", trend }) {
  return (
    <div className="rounded-xl border p-4 md:p-5 flex items-center gap-4 group hover:shadow-md hover:-translate-y-0.5 duration-200 transition-all bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
      <div
        className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${
          accentStyles[accent] || accentStyles.blue
        }`}
      >
        {Icon && <Icon size={22} className="group-hover:scale-105 duration-200 transition-all" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium truncate text-gray-500 dark:text-slate-400">
          {label}
        </p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-slate-100">
            {value ?? 0}
          </p>
          {trend && (
            <span
              className={`text-xs font-semibold ${
                trend.startsWith("-")
                  ? "text-red-500 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;