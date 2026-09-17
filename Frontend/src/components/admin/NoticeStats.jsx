import { useState, useEffect } from "react";
import { Megaphone, CalendarCheck2, Clock3, FileEdit } from "lucide-react";
import { api } from "../../data/api";


const accentStyles = {
  blue: "bg-blue-50 text-blue-600 border border-blue-100/60 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/50",
  green:
    "bg-emerald-50 text-emerald-600 border border-emerald-100/60 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/50",
  purple:
    "bg-purple-50 text-purple-600 border border-purple-100/60 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900/50",
  gray: "bg-slate-100 text-slate-600 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

function StatTile({ label, value, icon: Icon, accent, loading }) {
  return (
    <div className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden shadow-2xs">
      {/* Decorative background circle effect on hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 dark:bg-slate-800/40 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div
        className={`relative z-10 h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]} shadow-2xs`}
      >
        <Icon
          size={22}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="relative z-10 min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {label}
        </p>
        {loading ? (
          <div className="h-7 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NoticeStats() {
  const [stats, setStats] = useState({
    total_notice: 0,
    total_published_today: 0,
    scheduled: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Ensure you have a corresponding method in your NoticeApi wrapper
        const response = await api.get('/notice/getNoticeDashboard'); 
        const data = response.data?.data || response.data;
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch notice dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statItems = [
    { 
      label: "Total Notices", 
      value: stats.total_notice, 
      icon: Megaphone, 
      accent: "blue" 
    },
    {
      label: "Published Today",
      value: stats.total_published_today,
      icon: CalendarCheck2,
      accent: "green",
    },
    { 
      label: "Scheduled", 
      value: stats.scheduled, 
      icon: Clock3, 
      accent: "purple" 
    },
    { 
      label: "Draft", 
      value: stats.draft, 
      icon: FileEdit, 
      accent: "gray" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <StatTile key={item.label} {...item} loading={loading} />
      ))}
    </div>
  );
}