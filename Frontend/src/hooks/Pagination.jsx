import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage = 1, totalPages = 1, onPageChange, isDark = false }) {
  if (!totalPages || totalPages <= 1) return null;
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between pt-4">
      {/* ប៊ូតុង Prev */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
          isDark
            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <ChevronLeft size={15} />
        Prev
      </button>

      {/* បញ្ជីលេខទំព័រ */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className={`px-2 text-sm select-none ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                page === currentPage
                  ? isDark
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-blue-600 text-white shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* ប៊ូតុង Next */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
          isDark
            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        Next
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default Pagination;