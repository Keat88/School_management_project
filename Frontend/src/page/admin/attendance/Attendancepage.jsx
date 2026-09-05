import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock3, Percent } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import StatsGrid from "../../../components/admin/StatsGrid";
import AttendanceFilters from "../../../components/admin/Attendancefilters";
import AttendanceTable from "../../../components/admin/Attendancetable";

const TODAY = new Date().toISOString().slice(0, 10);

const mockAttendance = [
  {
    id: 1,
    studentName: "Sophea Kim",
    class: "Grade 9 - A",
    date: TODAY,
    checkInTime: "7:02 AM",
    status: "present",
  },
  {
    id: 2,
    studentName: "Dara Sok",
    class: "Grade 9 - A",
    date: TODAY,
    checkInTime: "7:15 AM",
    status: "late",
  },
  {
    id: 3,
    studentName: "Lina Chan",
    class: "Grade 9 - B",
    date: TODAY,
    checkInTime: null,
    status: "absent",
  },
  {
    id: 4,
    studentName: "Vichet Ros",
    class: "Grade 10 - A",
    date: TODAY,
    checkInTime: "6:58 AM",
    status: "present",
  },
  {
    id: 5,
    studentName: "Chenda Ly",
    class: "Grade 10 - A",
    date: TODAY,
    checkInTime: "7:01 AM",
    status: "present",
  },
  {
    id: 6,
    studentName: "Piseth Heng",
    class: "Grade 10 - B",
    date: TODAY,
    checkInTime: "7:20 AM",
    status: "late",
  },
  {
    id: 7,
    studentName: "Sreymom Ouk",
    class: "Grade 11 - A",
    date: TODAY,
    checkInTime: null,
    status: "absent",
  },
  {
    id: 8,
    studentName: "Ratanak Pich",
    class: "Grade 11 - A",
    date: TODAY,
    checkInTime: "6:55 AM",
    status: "present",
  },
];

function AttendancePage() {
  const { currentUser } = useAuth();

  const [dateValue, setDateValue] = useState(TODAY);
  const [classFilter, setClassFilter] = useState("all");

  const classOptions = useMemo(
    () => [...new Set(mockAttendance.map((r) => r.class))].sort(),
    [],
  );

  const filteredRecords = useMemo(() => {
    return mockAttendance.filter((record) => {
      const matchesDate = record.date === dateValue;
      const matchesClass =
        classFilter === "all" || record.class === classFilter;
      return matchesDate && matchesClass;
    });
  }, [dateValue, classFilter]);

  const summary = useMemo(() => {
    const presentCount = filteredRecords.filter(
      (r) => r.status === "present",
    ).length;
    const absentCount = filteredRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const lateCount = filteredRecords.filter((r) => r.status === "late").length;
    const total = filteredRecords.length;
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
      {
        label: "Absent",
        value: absentCount,
        icon: XCircle,
        accent: "orange",
      },
      {
        label: "Late",
        value: lateCount,
        icon: Clock3,
        accent: "purple",
      },
      {
        label: "Attendance Rate",
        value: `${rate}%`,
        icon: Percent,
        accent: "blue ",
      },
    ];
  }, [filteredRecords]);

  // Admin-only guard. For multiple admin-only pages, consider lifting
  // this into a shared <ProtectedRoute allowedRoles={["admin"]} />.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>

      <StatsGrid stats={summary} />
      <AttendanceFilters
        dateValue={dateValue}
        onDateChange={setDateValue}
        classFilter={classFilter}
        onClassChange={setClassFilter}
        classOptions={classOptions}
      />

      <AttendanceTable records={filteredRecords} />
    </div>
  );
}

export default AttendancePage;
