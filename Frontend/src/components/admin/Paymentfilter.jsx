import { Search } from "lucide-react";

function PaymentFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm
            text-gray-700 placeholder-gray-400 outline-none
            focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            transition-colors"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700
          outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          transition-colors w-full sm:w-44"
      >
        <option value="all">All Statuses</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>
  );
}

export default PaymentFilters;