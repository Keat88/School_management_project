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
    path: "/teachers",
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
        path: "/academic-year",
      },
      {
        id: 2,
        title: "Classes",
        path: "/classes",
      },
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: 4,
    title: "Students",
    path: "/students",
    icon: Users,
    roles: ["admin", "teacher"],
  },
  {
    id: 5,
    title: "Subjects",
    path: "/subjects",
    icon: FaBookOpen,
    roles: ["admin", "teacher"],
  },
  {
    id: 6,
    title: "Schedule",
    path: "/schedule",
    icon: CalendarDays,
    roles: ["admin", "teacher"],
  },
  {
    id: 7,
    title: "Attendance",
    path: "/attendance",
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
        path: "/library/category",
      },
      {
        id: 2,
        title: "Books",
        path: "/library/books",
      },
      {
        id: 3,
        title: "Book Issue",
        path: "/library/bookissue",
      },
      {
        id: 4,
        title: "Book Return",
        path: "/library/bookreturn",
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
        path: "/hostel",
      },
      {
        id: 2,
        title: "Hostel Rooms",
        path: "/hostel-rooms",
      },
      {
        id: 3,
        title: "Student Stay",
        path: "/hostel-stays",
      },
    ],
    roles: ["admin"],
  },
  {
    id: 10,
    title: "Finance",
    path: "/finance",
    icon: Wallet,
    roles: ["admin"],
  },
  {
    id: 11,
    title: "Notices",
    path: "/notices",
    icon: Megaphone,
    roles: ["admin", "teacher"],
  },
  {
    id: 12,
    title: "Reports",
    path: "/reports",
    icon: FileBarChart,
    roles: ["admin"],
  },
  {
    id: 13,
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export default sidebarMenu;
