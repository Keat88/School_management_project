import NoticeCard from "./NoticeCard";

function NoticeList({ notices = [], onEdit, onDelete }) {
  if (notices.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center text-sm text-slate-400 dark:text-slate-500 shadow-2xs transition-colors">
        No notices match your search or filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NoticeList;
