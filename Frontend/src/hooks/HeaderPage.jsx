import { AlertCircle, CheckCircle2 } from "lucide-react";

const HeaderPage = ({
  title,
  description,
  totalItems,
  titlefound,
  feedback,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-500/20">
            Total: {totalItems} {titlefound}
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold border transition-all animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
              : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2
              size={18}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="shrink-0 text-rose-600 dark:text-rose-400"
            />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </>
  );
};

export default HeaderPage;
