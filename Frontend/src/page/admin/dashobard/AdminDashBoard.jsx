import { Navigate } from "react-router-dom";
import { Users, GraduationCap, School, Wallet } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

import WelcomeBanner from "../../../components/admin/WelcomeBanner";
import StatCard from "../../../components/admin/Statscard";
import StatsGrid from "../../../components/admin/StatsGrid";
import FeeOverview from "../../../components/admin/FeeOverview";
import AttendanceOverview from "../../../components/admin/AttendanceOverview";
import RecentActivity from "../../../components/admin/RecentActivity";
import RecentNotices from "../../../components/admin/RecentNotices";

// Replace with real API data once available.
const mockStats = [
  { label: "Total Students", value: "1,284", icon: Users, accent: "blue", trend: "+3.2%" },
  { label: "Total Teachers", value: "76", icon: GraduationCap, accent: "green", trend: "+1" },
  { label: "Active Classes", value: "42", icon: School, accent: "orange" },
  { label: "Fees Collected", value: "$48,200", icon: Wallet, accent: "purple", trend: "+8.4%" }
];

const mockAttendanceByClass = [
  { className: "Grade 9 - A", rate: 96 },
  { className: "Grade 9 - B", rate: 91 },
  { className: "Grade 10 - A", rate: 88 },
  { className: "Grade 11 - A", rate: 94 }
];

const mockNotices = [
  { id: 1, title: "Mid-term exam schedule released", date: "Aug 28, 2026" },
  { id: 2, title: "Parent-teacher meeting on Sep 5", date: "Aug 26, 2026" },
  { id: 3, title: "Library closed for maintenance", date: "Aug 24, 2026" }
];

const mockActivity = [
  { id: 1, actor: "Mr. Chan", action: "marked attendance for Grade 10 - A", time: "10 minutes ago" },
  { id: 2, actor: "Admin", action: "added a new teacher, Ms. Reth", time: "1 hour ago" },
  { id: 3, actor: "System", action: "generated the monthly fee report", time: "3 hours ago" }
];

function AdminDashboard() {
  const { currentUser } = useAuth();

  // Page-level guard: only admins can view this page. For multiple
  // admin-only pages, consider lifting this into a shared
  // <ProtectedRoute allowedRoles={["admin"]} /> wrapper instead.
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner name={currentUser?.name} />

      <StatsGrid stats={mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceOverview overallRate={92} byClass={mockAttendanceByClass} />
        <FeeOverview collected={48200} pending={9800} total={58000} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentNotices notices={mockNotices} />
        <RecentActivity activities={mockActivity} />
      </div>
    </div>
  );
}

export default AdminDashboard;