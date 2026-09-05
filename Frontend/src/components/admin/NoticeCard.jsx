import { Pencil, Trash2 } from "lucide-react";
import AudienceBadge from "./AudienceBadge";

function formatDate(dateString) {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function NoticeCard({ notice, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col justify-between duration-200 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-800">
            {notice.title}
          </h3>
          <AudienceBadge audience={notice.audience} />
        </div>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {notice.content}
        </p>

        <p className="mt-3 text-xs text-gray-400">
          Publish date: {formatDate(notice.publishDate)}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(notice)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200
            text-sm font-medium text-gray-700 py-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(notice)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-red-100
            text-sm font-medium text-red-500 py-2 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoticeCard;