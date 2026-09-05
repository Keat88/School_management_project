import { Megaphone } from "lucide-react";

function RecentNotices({ notices = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Recent Notices
        </h3>
        <a href="/notices" className="text-sm text-blue-600 hover:underline">
          View all
        </a>
      </div>

      <ul className="space-y-3">
        {notices.length === 0 && (
          <li className="text-sm text-gray-400">No notices yet.</li>
        )}
        {notices.map((notice) => (
          <li key={notice.id} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Megaphone size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {notice.title}
              </p>
              <p className="text-xs text-gray-500">{notice.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentNotices;