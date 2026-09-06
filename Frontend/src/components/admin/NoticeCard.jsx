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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Decorative Top Accent Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 tracking-tight group-hover:text-blue-600 transition-colors">
            {notice.title}
          </h3>
          {notice.audience && <AudienceBadge audience={notice.audience} />}
        </div>

        {/* Notice Description */}
        <p className="mt-2.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {notice.description || "No description provided."}
        </p>

        {/* Metadata Section */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <User size={12} />
            </div>
            <span>
              Author: <strong className="font-medium text-slate-800">{authorName}</strong>
            </span>
          </div>

          {/* Publish Date */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <Calendar size={12} />
            </div>
            <span>
              Published: <strong className="font-medium text-slate-700">{formatDate(notice.publish_date)}</strong>
            </span>
          </div>

          {/* File Attachment Chip */}
          {attachmentUrl && (
            <div className="mt-1 flex items-center">
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 text-blue-700 hover:bg-blue-100 transition-colors text-xs font-medium max-w-full truncate border border-blue-100/60 shadow-2xs"
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
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onEdit(notice)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200
            text-xs font-semibold text-slate-700 py-2.5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-2xs"
        >
          <Pencil size={13} />
          Edit Notice
        </button>
        <button
          type="button"
          onClick={() => onDelete(notice)}
          className="flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-rose-50/60 border border-rose-100
            text-rose-600 py-2.5 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 shadow-2xs"
          title="Delete Notice"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default NoticeCard;