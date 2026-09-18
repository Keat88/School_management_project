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
import AttendanceOverview from "../../../components/admin/AttendanceOverview";
import RecentActivity from "../../../components/admin/RecentActivity";
import RecentNotices from "../../../components/admin/RecentNotices";
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
    key: "overall_rate", // Updated to use today's percentage rate from backend
    label: "Attendance Rate",
    icon: CalendarCheck,
    accent: "green",
    format: (v) => `${v ?? 0}%`,
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
    label: "Student Stay Dorminitory",
    icon: FileCheck2,
    accent: "teal",
  },
  {
    key: "total_hotelroom",
    label: "Hotel Rooms",
    icon: Hotel,
    accent: "rose",
  },
];

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await AdminDashboardApi.getCardData();
      // Extracts the merged data payload from your Laravel response structure: { message, data: { ... } }
      const result = response?.data?.data ?? response?.data ?? response ?? {};
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
    { name: "Books", students: data?.total_books ?? 0 },
    { name: "Teacher", students: data?.total_teachers ?? 0 },
    { name: "Class", students: data?.total_class ?? 0 },
    { name: "Student", students: data?.total_students ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <WelcomeBanner name={currentUser?.name} />

      {/* Stats Grid */}
      <StatsGrid stats={formattedStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceOverview
          overallRate={data?.overall_rate ?? 0}
          byClass={data?.by_class ?? []}
        />
        <ChartDashbaord data={dataChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentNotices notices={data?.notices ?? []} />
        <RecentActivity activities={data?.activity_logs ?? []} />
      </div>
    </div>
  );
}

export default AdminDashboard;
