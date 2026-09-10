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
      console.log(response)
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
      AddStudentHostelApi.delete(id);
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
    <div className="w-full mx-auto px-4 lg:min-w-160 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Manage Hostel Student Stays
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Overview of room allocations, student assignments, and occupancy
            timelines.
          </p>
        </div>
        <Link
          to="/admin/hostel-stays/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xs shrink-0"
        >
          <Plus size={18} />
          <span>Assign Bed / Room</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border duration-200 transition-transform hover:-translate-y-0.5 border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Allocations
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stats.total}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BedDouble size={22} />
          </div>
        </div>

        <div className="bg-white p-5 transition-transform hover:-translate-y-0.5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Stays
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stats.active}
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 transition-transform hover:-translate-y-0.5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Vacated / Completed
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stats.completed}
            </h3>
          </div>
          <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between gap-3 transition-all ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-green-600" />
            ) : (
              <AlertCircle size={18} className="shrink-0 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Container: Tabs & Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200  space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg w-full md:w-auto self-start">
            {[
              { id: "all", label: "All Stays" },
              { id: "active", label: "Active" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedStatus === tab.id
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, roll #, phone, or room..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors shrink-0"
                title="Clear Search"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Room & Bed</th>
                <th className="px-5 py-3.5">Stay Period</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium text-gray-500">
                        Loading stays list...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : currentStays.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <BedDouble size={32} className="text-gray-300 stroke-1" />
                      <p className="text-gray-500 text-sm font-medium">
                        No stay records found
                      </p>
                      <p className="text-gray-400 text-xs">
                        Try clearing your search or status filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentStays.map((stay) => {
                  const studentName =
                    stay.student?.student_name ||
                    stay.student?.name ||
                    "Student #" + (stay.student_id || stay.id);

                  const rollNo = stay.student?.roll_number || stay.roll_number;
                  const className =
                    stay.student?.class_room?.name ||
                    stay.student?.class_room?.class_name;
                  const phone = stay.student?.student_phone;

                  return (
                    <tr
                      key={stay.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Student Info */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs uppercase border border-blue-100">
                            {studentName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {studentName}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              {rollNo && (
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-gray-700 font-medium">
                                  Roll: {rollNo}
                                </span>
                              )}
                              {className && (
                                <span className="flex items-center gap-1 text-gray-500">
                                  <GraduationCap size={13} />
                                  {className}
                                </span>
                              )}
                              {phone && (
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Phone size={12} />
                                  {phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Room & Bed Assignment */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                            <Home size={14} className="text-gray-400" />
                            <span>
                              Room #
                              {stay.room?.room_number ||
                                stay.hostel_room?.room_number ||
                                stay.room_number ||
                                "N/A"}
                            </span>
                          </div>
                          {stay.bed_number && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                              <Hash size={12} className="text-gray-400" />
                              <span>Bed: {stay.bed_number}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stay Period */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar
                            size={14}
                            className="text-gray-400 shrink-0"
                          />
                          <span>
                            {stay.start_date || stay.assigned_date || "N/A"}
                          </span>
                          <span className="text-gray-300">&rarr;</span>
                          <span
                            className={
                              !stay.end_date
                                ? "text-green-600 font-medium"
                                : "text-gray-600"
                            }
                          >
                            {stay.end_date || "Present"}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            stay.status?.toLowerCase() === "active" ||
                            stay.status?.toLowerCase() === "checked-in"
                              ? "bg-green-50 text-green-700 border border-green-200/60"
                              : stay.status?.toLowerCase() === "completed"
                                ? "bg-gray-100 text-gray-700 border border-gray-200/60"
                                : "bg-red-50 text-red-700 border border-red-200/60"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-md ${
                              stay.status?.toLowerCase() === "active" ||
                              stay.status?.toLowerCase() === "checked-in"
                                ? "bg-green-500"
                                : stay.status?.toLowerCase() === "completed"
                                  ? "bg-gray-400"
                                  : "bg-red-500"
                            }`}
                          />
                          {stay.status || "N/A"}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/hostel-stays/add/${stay.id}`}
                            className="p-1 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200 hover:text-slate-500 hover:border-blue-200 transition-all"
                            title="Edit Record"
                          >
                           Update
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(stay.id)}
                            className="p-1 text-red-500 border border-gray-200 rounded-lg hover:bg-red-100 hover:text-red-600 hover:border-red-200 transition-all"
                            title="Delete Record"
                          >
                           Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
