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
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  orange: "bg-amber-50 text-amber-600 border-amber-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
};

export function StatCard({ label, value, icon: Icon, accent = "blue", trend }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 flex items-center gap-4 group hover:shadow-md hover:-translate-y-0.5 duration-200 transition-all">
      <div
        className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 ${
          accentStyles[accent] || accentStyles.blue
        }`}
      >
        {Icon && <Icon size={22} className="group-hover:scale-105 duration-200 transition-all" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
          {label}
        </p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            {value ?? 0}
          </p>
          {trend && (
            <span
              className={`text-xs font-semibold ${
                trend.startsWith("-") ? "text-red-500" : "text-emerald-600"
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