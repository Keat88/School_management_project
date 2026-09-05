import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  CalendarDays,
  BookOpen,
  Megaphone,
  Wallet,
  Building2,
  BedDouble,
  FileBarChart,
  Settings,
} from "lucide-react";
import { FaBookOpen } from "react-icons/fa6";

const sidebarMenu = [
  {
    id: 1,
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "teacher"],
  },
  {
    id: 2,
    title: "Teachers",
    path: "/admin/teachers",
    icon: GraduationCap,
    roles: ["admin"],
  },
  {
    id: 3,
    title: "Year & Class",
    icon: School,
    child: [
      {
        id: 1,
        title: "AcademicYear",
        path: "/admin/academic-year",
      },
      {
        id: 2,
        title: "Classes",
        path: "/admin/classes",
      },
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: 4,
    title: "Students",
    path: "/admin/students",
    icon: Users,
    roles: ["admin", "teacher"],
  },
  {
    id: 5,
    title: "Subjects",
    path: "/admin/subjects",
    icon: FaBookOpen,
    roles: ["admin", "teacher"],
  },
  {
    id: 6,
    title: "Schedule",
    path: "/admin/schedule",
    icon: CalendarDays,
    roles: ["admin", "teacher"],
  },
  {
    id: 7,
    title: "Attendance",
    path: "/admin/attendance",
    icon: CalendarDays,
    roles: ["admin", "teacher"],
  },
  {
    id: 8,
    title: "Library",
    icon: BookOpen,
    child: [
      {
        id: 1,
        title: "Book Category",
        path: "/admin/library/category",
      },
      {
        id: 2,
        title: "Books",
        path: "/admin/library/books",
      },
      {
        id: 3,
        title: "Book Issue",
        path: "/admin/library/bookissue",
      },
      {
        id: 4,
        title: "Book Return",
        path: "/admin/library/bookreturn",
      },
    ],
    roles: ["admin"],
  },
  {
    id: 9,
    title: "Hostel",
    icon: BedDouble,
    child: [
      {
        id: 1,
        title: "Building",
        path: "/admin/hostel",
      },
      {
        id: 2,
        title: "Hostel Rooms",
        path: "/admin/hostel-rooms",
      },
      {
        id: 3,
        title: "Student Stay",
        path: "/admin/hostel-stays",
      },
    ],
    roles: ["admin"],
  },
  {
    id: 10,
    title: "Finance",
    path: "/admin/finance",
    icon: Wallet,
    roles: ["admin"],
  },
  {
    id: 11,
    title: "Notices",
    path: "/admin/notices",
    icon: Megaphone,
    roles: ["admin", "teacher"],
  },
  {
    id: 12,
    title: "Reports",
    path: "/admin/reports",
    icon: FileBarChart,
    roles: ["admin"],
  },
  {
    id: 13,
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];
export default sidebarMenu;