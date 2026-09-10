import { useEffect, useState } from "react";
import { Search, DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { paymentApi } from "../../data/Payment";
import Pagination from "../../hooks/Pagination";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getAll({
          search: searchValue,
          status: statusFilter,
          category: categoryFilter,
          page: currentPage,
        });  
        setPayments(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
        // Capture Laravel pagination meta information
        if (res.meta) {
          setCurrentPage(res.meta.current_page);
          setLastPage(res.meta.last_page);
        }
      } catch (err) {
        console.error("Failed to load payments", err);
        setFeedback({ type: "error", text: "Failed to load payment records." });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, categoryFilter, currentPage]);

  // Reset to page 1 whenever filters or search query change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Payments & Finance</h1>
        <p className="text-xs text-gray-500 mt-1">Manage school tuition, dormitory, and course fees.</p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
          {feedback.text}
        </div>
      )}

      {/* Statistics Cards (Powered by Backend Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Revenue</p>
            <p className="text-xl font-bold text-gray-800">US${Number(stats.totalRevenue).toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Paid</p>
            <p className="text-xl font-bold text-gray-800">US${Number(stats.totalPaid).toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Pending</p>
            <p className="text-xl font-bold text-gray-800">US${Number(stats.totalPending).toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm">
          <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Overdue</p>
            <p className="text-xl font-bold text-gray-800">US${Number(stats.totalOverdue).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by student name..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-600 transition-all capitalize"
            >
              <option value="all">All Categories</option>
              <option value="tuition">Tuition</option>
              <option value="dormitory">Dormitory</option>
              <option value="course">Course</option>
            </select>

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:border-blue-600 transition-all capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading payments...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">No payment records found.</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 font-semibold text-gray-800 flex items-center gap-2.5">
                        <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {payment.student?.name ? payment.student.name.charAt(0) : "S"}
                        </span>
                        {payment.student?.name || "Unknown Student"}
                      </td>
                      <td className="p-3.5 capitalize">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                          {payment.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-gray-800">US${Number(payment.amount).toLocaleString()}</td>
                      <td className="p-3.5 text-gray-500">{payment.due_date}</td>
                      <td className="p-3.5 text-gray-500">{payment.method || "—"}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          payment.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                          payment.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination 
        totalPages={lastPage} 
        currentPage={currentPage} 
        onPageChange={(page) => setCurrentPage(page)} 
      />
    </div>
  );
}