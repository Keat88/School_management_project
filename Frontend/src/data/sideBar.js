import {
  LuLayoutDashboard,
  LuUsers,
  LuGraduationCap,
  LuSchool,
  LuCalendarDays,
  LuMegaphone,
  LuWallet,
  LuBedDouble,
  LuFileSpreadsheet,
  LuSettings,
  LuSquareCheck,
  LuBookOpen,
} from "react-icons/lu";
import {
  FaUser,
  FaBookOpen as FaBookOpenFa6,
  FaBookBookmark,
} from "react-icons/fa6";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaRegStickyNote } from "react-icons/fa";
import {
  MdCategory,
  MdOutlineAssignmentReturn,
  MdAssignmentTurnedIn,
} from "react-icons/md";

export const sidebarTeacherMenu = [
  {
    id: 1,
    title: "Home",
    path: "/teacher/dashboard",
    icon: LuLayoutDashboard,
    roles: ["admin", "teacher"],
  },
  {
    id: 2,
    title: "Class",
    path: "/teacher/class",
    icon: LuBookOpen,
    roles: ["admin", "teacher"],
  },
  {
    id: 3,
    title: "Reports",
    path: "/teacher/report",
    icon: LuFileSpreadsheet,
    roles: ["admin", "teacher"],
  },
  {
    id: 4,
    title: "Setting",
    path: "/teacher/setting",
    icon: LuSettings,
    roles: ["admin", "teacher"],
  },
];

export const sidebarMenu = [
  {
    id: 1,
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LuLayoutDashboard,
    roles: ["admin", "teacher"],
  },
  {
    id: 2,
    title: "List user",
    icon: LuSchool,
    child: [
      {
        id: 1,
        title: "Teachers",
        path: "/admin/teachers",
        icon: LuGraduationCap,
      },
      {
        id: 2,
        title: "Users",
        path: "/admin/users",
        icon: FaUser,
      },
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: 3,
    title: "Year & Class",
    icon: LuSchool,
    child: [
      {
        id: 1,
        title: "AcademicYear",
        path: "/admin/academic-year",
        icon: LuCalendarDays,
      },
      {
        id: 2,
        title: "Classes",
        path: "/admin/classes",
        icon: LuSchool,
      },
    ],
    roles: ["admin", "teacher"],
  },
  {
    id: 4,
    title: "Students",
    path: "/admin/students",
    icon: LuUsers,
    roles: ["admin", "teacher"],
  },
  {
    id: 5,
    title: "Subjects",
    path: "/admin/subjects",
    icon: FaBookOpenFa6,
    roles: ["admin", "teacher"],
  },
  {
    id: 6,
    title: "Schedule",
    path: "/admin/schedule",
    icon: LuCalendarDays,
    roles: ["admin", "teacher"],
  },
  {
    id: 7,
    title: "Attendance",
    path: "/admin/attendance",
    icon: LuSquareCheck,
    roles: ["admin", "teacher"],
  },
  {
    id: 8,
    title: "Library",
    icon: FaBookOpenFa6,
    child: [
      {
        id: 1,
        title: "Book Category",
        path: "/admin/library/category",
        icon: MdCategory,
      },
      {
        id: 2,
        title: "Books",
        path: "/admin/library/books",
        icon: FaBookBookmark,
      },
      {
        id: 3,
        title: "Book Issue",
        path: "/admin/library/bookissue",
        icon: MdAssignmentTurnedIn,
      },
      {
        id: 4,
        title: "Student Activity",
        path: "/admin/library/bookreturn",
        icon: MdOutlineAssignmentReturn,
      },
    ],
    roles: ["admin"],
  },
  {
    id: 9,
    title: "Dormitory",
    icon: LuBedDouble,
    child: [
      {
        id: 1,
        title: "Manage Dormitory",
        path: "/admin/hostel",
        icon: HiMiniBuildingOffice2,
      },
      {
        id: 2,
        title: "Dormitory Room",
        path: "/admin/hostel-rooms",
        icon: LuBedDouble,
      },
      {
        id: 3,
        title: "Live Dormitory",
        path: "/admin/hostel-stays",
        icon: LuUsers,
      },
    ],
    roles: ["admin"],
  },
  {
    id: 10,
    title: "Course",
    icon: FaBookOpenFa6,
    child: [
      {
        id: 1,
        title: "Course Category",
        path: "/admin/course/category",
        icon: MdCategory,
      },
      {
        id: 2,
        title: "Course",
        path: "/admin/course",
        icon: FaBookOpenFa6,
      },
      {
        id: 3,
        title: "Contact",
        path: "/admin/course/contact",
        icon: FaBookOpenFa6,
      },
    ],
    roles: ["admin"],
  },
  {
    id: 11,
    title: "Event",
    path: "/admin/notices",
    icon: FaRegStickyNote,
    roles: ["admin"],
  },
  {
    id: 12,
    title: "Reports",
    path: "/admin/reports",
    icon: LuFileSpreadsheet,
    roles: ["admin"],
  },
  {
    id: 13,
    title: "Settings",
    path: "/admin/settings",
    icon: LuSettings,
    roles: ["admin"],
  },
];