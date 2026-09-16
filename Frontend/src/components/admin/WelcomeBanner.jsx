export default function WelcomeBanner({ name }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const avatar =
    localStorage.getItem("userAvatar") || user?.avatar || user?.avatarUrl;
  const displayName = name || user?.name || "User";

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 mb-6 shadow-sm transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 dark:border dark:border-slate-800">
      <div className="flex items-center justify-between gap-4">
        {/* Welcome Text & Date */}
        <div className="space-y-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white truncate">
            Welcome back, {displayName} 👋
          </h2>
          <p className="text-xs sm:text-sm font-medium text-blue-100 dark:text-slate-400">
            {today}
          </p>
        </div>

        {/* User Avatar / Initials Badge */}
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-white/10 dark:bg-slate-800 text-white border border-white/20 dark:border-slate-700 items-center justify-center font-bold text-lg sm:text-xl shadow-inner overflow-hidden">
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
    </div>
  );
}
