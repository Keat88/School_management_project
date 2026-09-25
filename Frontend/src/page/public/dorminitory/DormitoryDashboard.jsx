import { useEffect, useState } from "react";
import {
  Building2,
  Bed,
  Users,
  Wrench,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { api } from "../../../data/api";

export default function DormitoryDashboard() {
  const navigate = useNavigate();

  // 1. Initial State for Dormitory Stats & Data
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    pendingMaintenance: 0,
  });

  const [recentAllocations, setRecentAllocations] = useState([]);
  const [managerName, setManagerName] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Fetch Dormitory Dashboard Data from API
  useEffect(() => {
    const fetchDormitoryDashboard = async () => {
      try {
        const response = await api.get("/dormitory/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const resData = response.data.data;

        setStats(resData.stats);
        setRecentAllocations(resData.recentAllocations || []);
        setManagerName(resData.manager_name || "Dormitory Manager");
      } catch (error) {
        console.error("Failed to fetch dormitory dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDormitoryDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-indigo-600 dark:border-indigo-400"></div>
          <span className="text-sm font-medium">Loading dormitory data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-700 to-purple-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {managerName}!
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            Oversee room allocations, track student check-ins, and manage dormitory maintenance requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dormitory/allocations/create`)}
            className="bg-white text-indigo-800 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Allocate Room</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Rooms
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.totalRooms}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Occupied Beds
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.occupiedBeds}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Bed size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Available Beds
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.availableBeds}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Wrench size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Pending Repairs
            </p>
            <h3 className="text-xl font-bold mt-0.5">{stats.pendingMaintenance}</h3>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Room Allocations (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Bed size={18} className="text-indigo-600" />
              <span>Recent Room Check-Ins</span>
            </h2>
            <button
              onClick={() => navigate("/dormitory/allocations")}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentAllocations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent room allocations recorded.
              </div>
            ) : (
              recentAllocations.map((allocation) => (
                <div
                  key={allocation.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">
                      Room {allocation.roomNumber} ({allocation.buildingName})
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned to <span className="font-medium text-slate-700 dark:text-slate-300">{allocation.studentName}</span> • Check-in: {allocation.checkInDate}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase ${
                      allocation.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    }`}
                  >
                    {allocation.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dormitory Notices & Policies */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              <span>Dormitory Notices</span>
            </h2>
          </div>

          <div className="space-y-3.5 flex-1">
            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                Curfew & Security Update
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                Main gate closes strictly at 10:00 PM every night. All residents must scan their student ID upon entry.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Water Supply Maintenance
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Building B water tank cleaning scheduled for this Saturday from 8:00 AM to 12:00 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}