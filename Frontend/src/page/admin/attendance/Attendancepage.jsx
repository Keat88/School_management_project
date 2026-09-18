import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, Percent, Search } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import StatsGrid from "../../../components/admin/StatsGrid";
import AttendanceFilters from "../../../components/admin/Attendancefilters";
import AttendanceTable from "../../../components/admin/Attendancetable";
import { api } from "../../../data/api";
import Pagination from "../../../hooks/Pagination";

const TODAY = new Date().toISOString().slice(0, 10);

function AttendancePage() {
  const { currentUser } = useAuth();

  const [dateValue, setDateValue] = useState(TODAY);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch class options for Dropdown Filter
  useEffect(() => {
    const fetchClassFilter = async () => {
      try {
        const res = await api.get("/class-activeform");
        const data = res?.data?.data || res?.data || res;
        setClassOptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching classes:", err);
      }
    };
    fetchClassFilter();
  }, []);

  // Reset to page 1 whenever any filter or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateValue, gradeFilter, sectionFilter, studentSearch, blockFilter]);

  // Fetch paginated attendance data from Laravel API
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          date: dateValue,
          ...(gradeFilter !== "all" && { grade: gradeFilter }),
          ...(sectionFilter !== "all" && { section: sectionFilter }),
          ...(studentSearch.trim() !== "" && { student_name: studentSearch }),
          ...(blockFilter !== "all" && { is_blocked: blockFilter }),
        };

        const response = await api.get("/attendance/index", { params });
        const responseJson = response?.data ?? {};

        // Extract items and pagination metadata correctly
        setAttendanceRecords(responseJson.data || []);
        setTotalPages(responseJson?.meta?.last_page || 1);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [
    currentPage,
    dateValue,
    gradeFilter,
    sectionFilter,
    studentSearch,
    blockFilter,
  ]);

  const formattedRecords = useMemo(() => {
    return attendanceRecords.map((record) => {
      let mappedStatus = "present";
      if (record.status === "A") mappedStatus = "absent";
      if (record.status === "PM") mappedStatus = "permission";

      return {
        id: record.id,
        studentName: record.studentName || "Unknown Student",
        absenceCount: record.absenceCount || 0,
        class: record.class || "—",
        date: record.date,
        checkInTime: record.checkInTime || "—",
        status: record.isLocked ? "blocked" : mappedStatus,
        isLocked: record.isLocked,
        hasUnreadMessage: record.hasUnreadMessage,
      };
    });
  }, [attendanceRecords]);

  const summary = useMemo(() => {
    const presentCount = formattedRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absentCount = formattedRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const permissionCount = formattedRecords.filter(
      (r) => r.status === "permission",
    ).length;

    const total = formattedRecords.length;
    const rate = total
      ? Math.round(((presentCount + permissionCount) / total) * 100)
      : 0;

    return [
      {
        label: "Present",
        value: presentCount,
        icon: CheckCircle2,
        accent: "green",
      },
      { label: "Absent", value: absentCount, icon: XCircle, accent: "orange" },
      {
        label: "Permission",
        value: permissionCount,
        icon: Clock3,
        accent: "purple",
      },
      {
        label: "Attendance Rate",
        value: `${rate}%`,
        icon: Percent,
        accent: "blue",
      },
    ];
  }, [formattedRecords]);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300">
          Attendance Monitoring
        </h2>
        <p className="text-xs sm:text-sm font-medium mt-1 text-slate-500 dark:text-slate-400">
          Configure and manage school subjects and course codes.
        </p>
      </div>

      <StatsGrid stats={summary} />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap gap-4 items-center justify-between">
        <AttendanceFilters
          dateValue={dateValue}
          onDateChange={setDateValue}
          classFilter={gradeFilter}
          onClassChange={setGradeFilter}
          classOptions={classOptions}
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

     
        <AttendanceTable records={formattedRecords} />
    

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AttendancePage;
