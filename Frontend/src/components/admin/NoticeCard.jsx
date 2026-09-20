import { Pencil, Trash2, Calendar, User, Paperclip } from "lucide-react";
import AudienceBadge from "./AudienceBadge";

function formatDate(dateString) {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFileName(url) {
  if (!url) return "View Attachment";
  try {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1].split("?")[0];
    return decodeURIComponent(lastSegment) || "View Attachment";
  } catch {
    return "View Attachment";
  }
}

function NoticeCard({ notice, onEdit, onDelete }) {
  const authorName = notice.user?.name || notice.author_name || "System";
  const attachmentUrl = notice.file || notice.attachment_url;
  const fileName = getFileName(attachmentUrl);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden">
      {/* Decorative Top Accent Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 tracking-tight group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
            {notice.title}
          </h3>
          {notice.audience && <AudienceBadge audience={notice.audience} />}
        </div>

        {/* Notice Description */}
        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {notice.description || "No description provided."}
        </p>

        {/* Metadata Section */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <User size={12} />
            </div>
            <span>
              Author:{" "}
              <strong className="font-medium text-slate-800 dark:text-slate-200">
                {authorName}
              </strong>
            </span>
          </div>

          {/* Publish Date */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <Calendar size={12} />
            </div>
            <span>
              Published:{" "}
              <strong className="font-medium text-slate-700 dark:text-slate-300">
                {formatDate(notice.publish_date)}
              </strong>
            </span>
          </div>

          {/* File Attachment Chip */}
          {attachmentUrl && (
            <div className="mt-1 flex items-center">
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors text-xs font-medium max-w-full truncate border border-blue-100/60 dark:border-blue-900/50 shadow-2xs"
                title={fileName}
              >
                <Paperclip size={12} className="shrink-0" />
                <span className="truncate">{fileName}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onEdit(notice)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700
            text-xs font-semibold text-slate-700 dark:text-slate-200 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:hover:border-blue-500 transition-all duration-200 shadow-2xl cursor-pointer"
        >
          <Pencil size={13} />
          Edit Notice
        </button>
        <button
          type="button"
          onClick={() => onDelete(notice)}
          className="flex items-center justify-center gap-1.5 px-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50
            text-rose-600 dark:text-rose-400 py-2.5 hover:bg-rose-500 hover:text-white hover:border-rose-500 dark:hover:bg-rose-500 dark:hover:text-white dark:hover:border-rose-500 transition-all duration-200 shadow-2xl cursor-pointer"
          title="Delete Notice"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default NoticeCard;
