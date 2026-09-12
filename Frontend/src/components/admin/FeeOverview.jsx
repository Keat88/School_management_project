function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function FeeOverview({ collected, pending, total }) {
  const collectedPct = total ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
      <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">
        Fee Overview
      </h3>

      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Collected</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">
            {formatCurrency(collected)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-slate-400">Pending</p>
          <p className="text-lg font-semibold text-orange-500 dark:text-orange-400">
            {formatCurrency(pending)}
          </p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-green-500 dark:bg-emerald-500"
          style={{ width: `${collectedPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        {collectedPct}% of {formatCurrency(total)} collected this term
      </p>
    </div>
  );
}

export default FeeOverview;