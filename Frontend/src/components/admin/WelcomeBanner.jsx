export default function WelcomeBanner({ name }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const avatar = localStorage.getItem("userAvatar") || user?.avatar || user?.avatarUrl;
  const displayName = name || user?.name || "User";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 flex items-center justify-between shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Welcome back, {displayName}
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          {today}
        </p>
      </div>
      <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 items-center justify-center font-bold text-xl shadow-sm overflow-hidden">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{displayName?.charAt(0) || "A"}</span>
        )}
      </div>
    </div>
  );
}