import { Megaphone, CalendarCheck2, Clock3, FileEdit } from "lucide-react";

const accentStyles = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100/60",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
  purple: "bg-purple-50 text-purple-600 border border-purple-100/60",
  gray: "bg-slate-100 text-slate-600 border border-slate-200/60"
};

function StatTile({ label, value, icon: Icon, accent }) {
  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-300 overflow-hidden">
      {/* Decorative background circle effect on hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div
        className={`relative z-10 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]} shadow-2xs`}
      >
        <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="relative z-10 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function NoticeStats({ notices = [] }) {
  const today = new Date().toISOString().slice(0, 10);

  const total = notices.length;
  const publishedToday = notices.filter(
    (n) => n.status === "published" && n.publishDate === today
  ).length;
  const scheduled = notices.filter((n) => n.status === "scheduled").length;
  const draft = notices.filter((n) => n.status === "draft").length;

  const stats = [
    { label: "Total Notices", value: total, icon: Megaphone, accent: "blue" },
    { label: "Published Today", value: publishedToday, icon: CalendarCheck2, accent: "green" },
    { label: "Scheduled", value: scheduled, icon: Clock3, accent: "purple" },
    { label: "Draft", value: draft, icon: FileEdit, accent: "gray" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatTile key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export default NoticeStats;