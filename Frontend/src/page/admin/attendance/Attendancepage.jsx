import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, Percent, Search } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import StatsGrid from "../../../components/admin/StatsGrid";
import AttendanceFilters from "../../../components/admin/Attendancefilters";
import AttendanceTable from "../../../components/admin/Attendancetable";
import { api } from "../../../data/api";

const TODAY = new Date().toISOString().slice(0, 10);

function AttendancePage() {
  const { currentUser } = useAuth();

  const [dateValue, setDateValue] = useState(TODAY);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  // Fetch data from Laravel API matching UnBlockAttendance controller
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const params = {
          date: dateValue,
          ...(gradeFilter !== "all" && { grade: gradeFilter }),
          ...(sectionFilter !== "all" && { section: sectionFilter }),
          ...(studentSearch.trim() !== "" && { student_name: studentSearch }),
          ...(blockFilter !== "all" && { is_blocked: blockFilter }),
          all: true, // Fetching all for client calculations or use pagination
        };

        const response = await api.get("/block-attendance", { params });
        // Handling Laravel response structure: { status: 'success', data: [...] or paginated object }
        const resData = response.data.data;
        setAttendanceRecords(
          Array.isArray(resData) ? resData : resData.data || [],
        );
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [dateValue, gradeFilter, sectionFilter, studentSearch, blockFilter]);

  // Map backend records to match table props structure if needed
  const formattedRecords = useMemo(() => {
    return attendanceRecords.map((record) => ({
      id: record.id,
      studentName: record.student?.student_name || "Unknown Student",
      class: `Grade ${record.classRoom?.grade || "-"} - ${record.classRoom?.section || "-"}`,
      date: record.date,
      checkInTime: record.created_at
        ? new Date(record.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      status: record.is_blocked ? "blocked" : record.status || "present",
      isUnlocked: record.is_unlocked,
    }));
  }, [attendanceRecords]);

  const summary = useMemo(() => {
    const presentCount = formattedRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absentCount = formattedRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const lateCount = formattedRecords.filter(
      (r) => r.status === "late",
    ).length;
    const total = formattedRecords.length;
    const rate = total
      ? Math.round(((presentCount + lateCount) / total) * 100)
      : 0;

    return [
      {
        label: "Present",
        value: presentCount,
        icon: CheckCircle2,
        accent: "green",
      },
      { label: "Absent", value: absentCount, icon: XCircle, accent: "orange" },
      { label: "Late", value: lateCount, icon: Clock3, accent: "purple" },
      {
        label: "Attendance Rate",
        value: `${rate}%`,
        icon: Percent,
        accent: "blue",
      },
    ];
  }, [formattedRecords]);

  return (
    <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        Attendance Monitoring
      </h2>

      <StatsGrid stats={summary} />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <AttendanceFilters
          dateValue={dateValue}
          onDateChange={setDateValue}
          classFilter={gradeFilter}
          onClassChange={setGradeFilter}
          classOptions={[]}
        />
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search student name..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">
          Loading attendance data...
        </div>
      ) : (
        <AttendanceTable records={formattedRecords} />
      )}
    </div>
  );
}

export default AttendancePage;
