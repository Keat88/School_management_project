import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { AuthApi } from "../../data/AuthApi";
import { useTheme } from "../../context/ThemeContext";
import LoadingModal from "../../hooks/LoadingModal";
import { SiAdminer } from "react-icons/si";
import { CgWebsite } from "react-icons/cg";
const roleBadgeStyles = {
  admin:
    "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-900",
  staff:
    "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-900",
  student:
    "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-900",
};

const roleLabels = {
  admin: "Administrator",
  staff: "Staff Member",
  student: "Student",
};

export default function Navbar({ title, notificationCount = 0 }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Safely consume global theme and accent color states
  const { isDarkMode, toggleTheme, accentColor = "#2563EC" } = useTheme() || {};
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const currentSetting =
    currentUser?.role === "admin"
      ? "/admin/settings"
      : currentUser?.role === "teacher"
        ? "/teacher/settings"
        : currentUser?.role === "librarian"
          ? "/librarian/library/settings"
          : currentUser?.role === "supervisor"
            ? "/supervisor/setting"
            : "/";
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await AuthApi.Logout();
      if (response.status === "success") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("Avatar");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error", error);
    } finally {
      setLoading(false);
    }
  };
  const WebsitePage =
    currentUser?.role === "admin" ||
    currentUser?.user === "teacher" ||
    currentUser?.role === "librarian";
  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Completing Logout..."
        subtitle="Finalizing your request"
      />
      <header className="max-md:hidden  w-full bg-white dark:bg-slate-900 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="flex items-center justify-between px-6 md:px-8 h-18">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                <span>Welcome</span>
                <span style={{ color: accentColor }}>
                  {currentUser?.name || title || "User"}
                </span>
              </h1>
            </div>
          </div>

          {/* Grouped all right-side controls inside a single flex container */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Global Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 focus:outline-none group p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                {/* Avatar container styled with the stored accent color border */}
                <div
                  style={{ borderColor: accentColor }}
                  className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-2 flex items-center justify-center font-bold uppercase shrink-0 shadow-sm overflow-hidden transition-all"
                >
                  {currentUser?.avatarUrl || currentUser?.avatar ? (
                    <img
                      src={currentUser?.avatarUrl || currentUser?.avatar}
                      alt={currentUser?.name || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser?.name?.charAt(0) || "U"
                  )}
                </div>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-100 truncate uppercase max-w-[140px]">
                    {currentUser?.name || "User"}
                  </span>
                  <span className="mt-0.5 inline-flex w-fit items-center text-gray-500 rounded-md text-[10px] font-bold tracking-wide">
                    {currentUser.email}
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 hidden md:block ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 md:hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser?.name || "User"}
                    </p>
                    <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                      {currentUser.email}
                    </span>
                  </div>

                  <div className="space-y-0.5 py-1">
                    <NavLink
                      to="/admin/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <span>Profile</span>
                      <User
                        size={16}
                        className="text-slate-400 dark:text-slate-400"
                      />
                    </NavLink>
                    <NavLink
                      to={"/"}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <span>Website</span>
                      <CgWebsite
                        size={16}
                        className="text-slate-400 dark:text-slate-400"
                      />
                    </NavLink>
                    <NavLink
                      to={currentSetting}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      <span>Settings</span>
                      <Settings
                        size={16}
                        className="text-slate-400 dark:text-slate-400"
                      />
                    </NavLink>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <span>Logout</span>
                    <LogOut
                      size={16}
                      className="text-rose-500 dark:text-rose-400"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
