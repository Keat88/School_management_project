import NoticeCard from "./NoticeCard";

function NoticeList({ notices = [], onEdit, onDelete }) {
  if (notices.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
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