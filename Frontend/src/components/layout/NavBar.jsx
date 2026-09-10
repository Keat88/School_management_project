import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { AuthApi } from "../../data/AuthApi";
import { NavLink } from "react-router-dom";
import LoadingModal from "../../hooks/LoadingModal";
import { SiAdminer } from "react-icons/si";
const roleBadgeStyles = {
  admin: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  teacher: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};

const roleLabels = {
  admin: "Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

function deriveTitleFromPath(pathname) {
  const segment = pathname.split("/").filter(Boolean)[0] || "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function Navbar({ title, notificationCount = 0 }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const pageTitle = title || deriveTitleFromPath(location.pathname);
  const role = currentUser?.role;
  const badgeStyle =
    roleBadgeStyles[role] ||
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";
  const badgeLabel = roleLabels[role] || "Guest";

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

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await AuthApi.Logout();
      if (response.status === "success") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Completing Logout..."
        subtitle="Finalizing your request"
      />
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between px-4 md:px-8 h-16">
          {/* Page Title */}
          <h1 className="text-lg md:text-xl max-md:text-sm font-bold t flex justify-center items-center">
            <SiAdminer size={30} className="text-indigo-400" /> WelCome
            <span className="text-blue-600 uppercase ">{currentUser?.name}</span>
          </h1>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Notification Button */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            <div className="hidden md:block h-6 w-px bg-slate-200" />

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 focus:outline-none group p-1 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold uppercase shrink-0 shadow-xs group-hover:border-blue-200 transition-all">
                  {currentUser?.avatarUrl || currentUser?.avatar ? (
                    <img
                      src={currentUser?.avatarUrl || currentUser?.avatar}
                      alt={currentUser?.name || "User avatar"}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    currentUser?.name?.charAt(0) || "U"
                  )}
                </div>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 truncate max-w-[140px]">
                    {currentUser?.name || "User"}
                  </span>
                  <span
                    className={`mt-0.5 inline-flex w-fit items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase ${badgeStyle}`}
                  >
                    {badgeLabel}
                  </span>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 hidden md:block ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/80 text-slate-700 rounded-2xl shadow-xl shadow-slate-200/60 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 md:hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {currentUser?.name || "User"}
                    </p>
                    <span
                      className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${badgeStyle}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <NavLink
                      to="/admin/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <span>Profile</span>
                      <User size={16} className="text-slate-400" />
                    </NavLink>
                    <NavLink
                      to="/admin/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <span>Settings</span>
                      <Settings size={16} className="text-slate-400" />
                    </NavLink>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <span>Logout</span>
                    <LogOut size={16} className="text-rose-500" />
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

export default Navbar;
