import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Calendar,
  RotateCcw,
  BedDouble,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  Hash,
  Phone,
  GraduationCap,
} from "lucide-react";
import { api } from "../../../data/api";
import { AddStudentHostelApi } from "../../../data/Hostel";
import Pagination from "../../../hooks/Pagination";

export default function ManageStudentStays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStays = async () => {
    setLoading(true);
    try {
      const response = await AddStudentHostelApi.getAll();
      const result =
        response.data?.data?.data || response.data?.data || response.data || [];
      setStays(result);
    } catch (error) {
      if (error.response?.status === 404) {
        setStays([]);
      } else {
        console.error("Error fetching student stays:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  // Reset pagination when search or status filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this stay record?"))
      return;
    try {
      await AddStudentHostelApi.delete(id);
      setFeedback({
        type: "success",
        text: "Stay record deleted successfully!",
      });
      setStays((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to delete stay record.",
      });
    }
  };

  // Filtered dataset matched against Laravel relationships
  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const studentName = (
        stay.student?.student_name ||
        stay.student?.name ||
        ""
      ).toLowerCase();
      const rollNumber = (
        stay.student?.roll_number ||
        stay.roll_number ||
        ""
      ).toLowerCase();
      const studentPhone = (stay.student?.student_phone || "").toLowerCase();
      const bedNumber = String(stay.bed_number || "").toLowerCase();
      const roomNumber = String(
        stay.room?.room_number ||
          stay.hostel_room?.room_number ||
          stay.room_number ||
          "",
      ).toLowerCase();
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        studentName.includes(query) ||
        rollNumber.includes(query) ||
        studentPhone.includes(query) ||
        bedNumber.includes(query) ||
        roomNumber.includes(query);

      const matchesStatus =
        selectedStatus === "all" ||
        stay.status?.toLowerCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [stays, search, selectedStatus]);

  const totalPages = Math.ceil(filteredStays.length / itemsPerPage) || 1;

  const currentStays = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStays.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStays, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const total = stays.length;
    const active = stays.filter((s) =>
      ["active", "checked-in"].includes(s.status?.toLowerCase()),
    ).length;
    const completed = stays.filter(
      (s) => s.status?.toLowerCase() === "completed",
    ).length;
    return { total, active, completed };
  }, [stays]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 space-y-6 p-2 sm:p-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Hostel Student Stays
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage room allocations, student assignments, and occupancy
            timelines.
          </p>
        </div>
        <Link
          to="/admin/hostel-stays/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Plus size={15} />
          <span>Assign Bed / Room</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 max-md:grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Total Allocations
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.total}
            </h3>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 rounded-xl">
            <BedDouble size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Active Stays
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.active}
            </h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Vacated / Completed
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stats.completed}
            </h3>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-xl">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2
                size={16}
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />
            ) : (
              <AlertCircle
                size={16}
                className="shrink-0 text-rose-600 dark:text-rose-400"
              />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-[11px] font-semibold underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Container: Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full md:w-auto self-start">
            {[
              { id: "all", label: "All Stays" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex items-center gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, roll #, phone..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
              />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-2.5 sm:p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Clear Search"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Section (Hybrid: Card stack for mobile, Table for desktop) */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Loading stays list...
              </span>
            </div>
          </div>
        ) : currentStays.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-400 dark:text-slate-500">
            <div className="flex flex-col items-center justify-center space-y-2">
              <BedDouble
                size={28}
                className="text-slate-300 dark:text-slate-600"
              />
              <p className="text-slate-700 dark:text-slate-200 font-semibold">
                No stay records found
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">
                Try clearing your search or status filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card Stack (< md) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentStays.map((stay) => {
                const studentName =
                  stay.student?.student_name ||
                  stay.student?.name ||
                  "Student #" + (stay.student_id || stay.id);

                const rollNo = stay.student?.roll_number || stay.roll_number;
                const className =
                  stay.student?.class_room?.name ||
                  stay.student?.class_room?.class_name;
                const phone = stay.student?.student_phone;

                const statusLower = stay.status?.toLowerCase();
                const isActive =
                  statusLower === "active" || statusLower === "checked-in";
                const isCompleted = statusLower === "completed";

                return (
                  <div
                    key={stay.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center shrink-0 font-semibold text-xs uppercase border border-blue-100 dark:border-blue-900/30">
                          {studentName.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {studentName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                            {rollNo && (
                              <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">
                                Roll: {rollNo}
                              </span>
                            )}
                            {className && (
                              <span className="flex items-center gap-1">
                                <GraduationCap size={11} />
                                {className}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40"
                            : isCompleted
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive
                              ? "bg-emerald-500"
                              : isCompleted
                                ? "bg-slate-400"
                                : "bg-rose-500"
                          }`}
                        />
                        {stay.status || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-slate-800 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                          Room & Bed
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <Home size={13} className="text-slate-400 shrink-0" />
                          <span>
                            Room #
                            {stay.room?.room_number ||
                              stay.hostel_room?.room_number ||
                              stay.room_number ||
                              "N/A"}
                          </span>
                          {stay.bed_number && (
                            <span className="text-slate-500 font-mono text-[11px]">
                              (Bed: {stay.bed_number})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                          Stay Period
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Calendar
                            size={13}
                            className="text-slate-400 shrink-0"
                          />
                          <span>
                            {stay.start_date || stay.assigned_date || "N/A"}
                          </span>
                          <span>&rarr;</span>
                          <span
                            className={
                              !stay.end_date
                                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                : ""
                            }
                          >
                            {stay.end_date || "Present"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {phone && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />
                        <span>{phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Link
                        to={`/admin/hostel-stays/add/${stay.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold text-xs shadow-xs"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(stay.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-semibold text-xs shadow-xs cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP VIEW: Table Layout (hidden md:block) */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="px-5 py-3.5">Student Details</th>
                      <th className="px-5 py-3.5">Room & Bed</th>
                      <th className="px-5 py-3.5">Stay Period</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                    {currentStays.map((stay) => {
                      const studentName =
                        stay.student?.student_name ||
                        stay.student?.name ||
                        "Student #" + (stay.student_id || stay.id);

                      const rollNo =
                        stay.student?.roll_number || stay.roll_number;
                      const className =
                        stay.student?.class_room?.name ||
                        stay.student?.class_room?.class_name;
                      const phone = stay.student?.student_phone;

                      const statusLower = stay.status?.toLowerCase();
                      const isActive =
                        statusLower === "active" ||
                        statusLower === "checked-in";
                      const isCompleted = statusLower === "completed";

                      return (
                        <tr
                          key={stay.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center shrink-0 font-semibold text-[11px] uppercase border border-blue-100 dark:border-blue-900/30">
                                {studentName.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                  {studentName}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                  {rollNo && (
                                    <span className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">
                                      Roll: {rollNo}
                                    </span>
                                  )}
                                  {className && (
                                    <span className="flex items-center gap-1">
                                      <GraduationCap size={12} />
                                      {className}
                                    </span>
                                  )}
                                  {phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone size={11} />
                                      {phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                                <Home size={13} className="text-slate-400" />
                                <span>
                                  Room #
                                  {stay.room?.room_number ||
                                    stay.hostel_room?.room_number ||
                                    stay.room_number ||
                                    "N/A"}
                                </span>
                              </div>
                              {stay.bed_number && (
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                  <Hash size={11} className="text-slate-400" />
                                  <span>Bed: {stay.bed_number}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <Calendar
                                size={13}
                                className="text-slate-400 shrink-0"
                              />
                              <span>
                                {stay.start_date || stay.assigned_date || "N/A"}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600">
                                &rarr;
                              </span>
                              <span
                                className={
                                  !stay.end_date
                                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                    : ""
                                }
                              >
                                {stay.end_date || "Present"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40"
                                  : isCompleted
                                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive
                                    ? "bg-emerald-500"
                                    : isCompleted
                                      ? "bg-slate-400"
                                      : "bg-rose-500"
                                }`}
                              />
                              {stay.status || "N/A"}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/admin/hostel-stays/add/${stay.id}`}
                                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold text-[11px] shadow-xs"
                                title="Edit Record"
                              >
                                Edit
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(stay.id)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-semibold text-[11px] shadow-xs cursor-pointer"
                                title="Delete Record"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Render Pagination only when data is loaded and records exist */}
      {!loading && filteredStays.length > 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
