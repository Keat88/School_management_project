import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  DoorOpen,
  Hotel,
  CalendarCheck,
  BookMarked,
  BookOpen,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { AdminDashboardApi } from "../../../data/Dashboard";
import WelcomeBanner from "../../../components/admin/WelcomeBanner";
import StatsGrid from "../../../components/admin/StatsGrid";
import FeeOverview from "../../../components/admin/FeeOverview";
import AttendanceOverview from "../../../components/admin/AttendanceOverview";
import RecentActivity from "../../../components/admin/RecentActivity";
import RecentNotices from "../../../components/admin/RecentNotices";
import { api } from "../../../data/api";
import ChartDashbaord from "../../../components/admin/ChartDashbaord";
const STAT_SCHEMA = [
  {
    key: "total_students",
    label: "Total Students",
    icon: Users,
    accent: "blue",
  },
  {
    key: "total_teachers",
    label: "Total Teachers",
    icon: GraduationCap,
    accent: "indigo",
  },
  {
    key: "total_class",
    label: "Total Classes",
    icon: DoorOpen,
    accent: "purple",
  },
  {
    key: "total_attendance",
    label: "Attendance Rate",
    icon: CalendarCheck,
    accent: "green",
    format: (v) => `${v}%`,
  },
  {
    key: "total_books",
    label: "Total Books",
    icon: BookOpen,
    accent: "orange",
  },
  {
    key: "total_book_category",
    label: "Book Categories",
    icon: BookMarked,
    accent: "cyan",
  },
  {
    key: "total_studentassignments",
    label: "Assignments",
    icon: FileCheck2,
    accent: "teal",
  },
  { key: "total_hotelroom", label: "Hotel Rooms", icon: Hotel, accent: "rose" },
];
function AdminDashboard() {
  const { currentUser } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activetyLog, setActivityLog] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AdminDashboardApi.getCardData();
      const result = response?.data?.data ?? response?.data ?? response ?? {};
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard card data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getRecently = async () => {
    const response = await api.get("/get-recently");
    const data = response?.data || response?.data?.data || response?.data?.data?.data || response;
    setActivityLog(data?.data?.activity_logs);
  };
  useEffect(() => {
    getRecently();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  // Map API object to array for StatsGrid
  const formattedStats = STAT_SCHEMA.map((item) => {
    const rawVal = data?.[item.key] ?? 0;
    return {
      key: item.key,
      label: item.label,
      value: loading ? "..." : item.format ? item.format(rawVal) : rawVal,
      icon: item.icon,
      accent: item.accent,
    };
  });
  const dataChart = [
      {
          name: "Books",
          students: data.total_books

      },
      {
          name: "Teacher",
          students: data.total_teachers

      },
      {
          name: "Class",
          students:data.total_class
      },
      {
          name: "Student",
          students: data.total_students
      },
  ];
  console.log(data)
  return (
    <div className="space-y-6 p-4 md:p-6">
      <WelcomeBanner name={currentUser?.name} />

      {/* Render converted array */}
      <StatsGrid stats={formattedStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceOverview
          overallRate={data?.total_attendance ?? 92}
          byClass={[]}
        />
        <ChartDashbaord data={dataChart}/>
        {/* <FeeOverview collected={48200} pending={9800} total={58000} /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentNotices notices={[]} />
        <RecentActivity activities={[]} />
      </div>
    </div>
  );
}

export default AdminDashboard;
