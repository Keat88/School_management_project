import { Megaphone } from "lucide-react";

function RecentNotices({ notices = [] }) {
  // Helper to format target audience text nicely (e.g., "single_teacher" -> "Single Teacher")
  const formatAudience = (audience) => {
    if (!audience) return "";
    return audience
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100">
          Recent Notices
        </h3>
        <a
          href="/admin/notices"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </a>
      </div>

      <ul className="space-y-3">
        {notices.length === 0 && (
          <li className="text-sm text-gray-400 dark:text-slate-500 py-6 text-center">
            No notices yet.
          </li>
        )}

        {notices.map((notice) => (
          <li
            key={notice.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-800/30 transition-colors"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
              <Megaphone size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                  {notice.title}
                </h4>
                {notice.publish_date && (
                  <span className="text-xs text-gray-400 dark:text-slate-500 shrink-0">
                    {notice.publish_date}
                  </span>
                )}
              </div>

              {notice.content && (
                <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {notice.content}
                </p>
              )}

              {notice.target_audience && (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                    {formatAudience(notice.target_audience)}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentNotices;
