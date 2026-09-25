import { useEffect, useState } from "react";
import {
  BookOpen,
  BookMarked,
  Users,
  Clock,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  BookmarkCheck,
  Search,
} from "lucide-react";
import { api } from "../../data/api";
import { useNavigate } from "react-router-dom";

export default function LibrarianDashboard() {
  const navigate = useNavigate();

  // 1. Initial State for Librarian Stats & Data
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
    totalMembers: 0,
  });

  const [recentLoans, setRecentLoans] = useState([]);
  const [librarianName, setLibrarianName] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Fetch Librarian Dashboard Data from API
  useEffect(() => {
    const fetchLibrarianDashboard = async () => {
      try {
        const response = await api.get("/librarian/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const resData = response.data.data;

        setStats(resData.stats);
        setRecentLoans(resData.recentLoans || []);
        setLibrarianName(resData.librarian_name || "Librarian");
      } catch (error) {
        console.error("Failed to fetch librarian dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarianDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-teal-600 dark:border-teal-400"></div>
          <span className="text-sm font-medium">Loading library data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-700 to-green-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {librarianName}!
          </h1>
          <p className="text-teal-100 text-sm mt-1">
            Manage book inventories, track issued loans, and oversee library member activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/librarian/books/create`)}
            className="bg-white text-teal-800 hover:bg-teal-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Books
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.totalBooks}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookMarked size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Issued Books
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.issuedBooks}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Overdue Loans
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.overdueBooks}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Active Members
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.totalMembers}</h3>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Book Loans (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <BookMarked size={18} className="text-teal-600" />
              <span>Recent Book Loans</span>
            </h2>
            <button
              onClick={() => navigate("/librarian/loans")}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentLoans.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent book loans recorded.
              </div>
            ) : (
              recentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{loan.bookTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Borrowed by <span className="font-medium text-slate-700 dark:text-slate-300">{loan.memberName}</span> • Due: {loan.dueDate}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase ${
                      loan.status === "Returned"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : loan.status === "Overdue"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                        : "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300"
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Library Notices & Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock size={18} className="text-teal-600" />
              <span>Library Notices</span>
            </h2>
          </div>

          <div className="space-y-3.5 flex-1">
            <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20">
              <h4 className="text-xs font-bold text-teal-900 dark:text-teal-300">
                New Textbook Shipment
              </h4>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
                The shipment of 2026 Software Engineering reference books has arrived. Please verify and catalog them into the system.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Annual Inventory Audit
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Scheduled stock check will take place next Monday morning. Library reading room will be temporarily closed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}