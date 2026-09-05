import { Megaphone, CalendarCheck2, Clock3, FileEdit } from "lucide-react";

const accentStyles = {
  blue: "bg-blue-50 text-[#2563EB]",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-gray-100 text-gray-500"
};

function StatTile({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 group flex items-center gap-4 duration-200 transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]}`}
      >
        <Icon size={20} className="group-hover:scale-110 duration-200 transition-all" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
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