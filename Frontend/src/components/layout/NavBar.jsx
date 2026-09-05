import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
import { AuthApi } from "../../data/AuthApi";
import { NavLink } from "react-router-dom";
const roleBadgeStyles = {
  admin: "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
  teacher: "bg-green-50 text-green-600 ring-1 ring-inset ring-green-200",
  student: "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-200",
  parent: "bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-200",
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
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const pageTitle = title || deriveTitleFromPath(location.pathname);
  const role = currentUser?.role;
  const badgeStyle =
    roleBadgeStyles[role] ||
    "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200";
  const badgeLabel = roleLabels[role] || "Guest";
  const [open, isOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await AuthApi.Logout();
      if (response.status === "success") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        {/* Page title */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 shrink-0">
          {pageTitle}
        </h1>

        {/* Search input */}
        <div className="flex-1 max-w-md ml-2 hidden sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm
                text-gray-700 placeholder-gray-400 outline-none
                focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                transition-colors"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          {/* Mobile search trigger */}
          <button
            type="button"
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Notification icon */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Divider */}
          <div className="hidden md:block h-8 w-px bg-gray-200" />

          {/* User avatar, name, role badge */}
          <div className="flex items-center gap-2.5 relative">
            <button type="button" onMouseEnter={() => isOpen(true)}>
              <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold uppercase shrink-0">
                {currentUser?.avatarUrl || currentUser.avatar ? (
                  <img
                    src={currentUser.avatarUrl || currentUser.avatar}
                    alt={currentUser?.name || "User avatar"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  currentUser?.name?.charAt(0) || "U"
                )}
              </div>
            </button>
            {open && (
              <div
                onMouseEnter={() => isOpen(true)}
                onMouseLeave={() => isOpen(false)}
                className="text-sm absolute -right-5 w-40 p-3 top-13 bg-white border border-gray-500/30 text-gray-800/80 rounded-md font-medium"
              >
                <ul className="flex flex-col gap-px">
                  <NavLink
                    to={"/profile"}
                    className="flex items-center justify-between gap-2 cursor-pointer px-3 py-2 rounded hover:bg-gray-500/20 transition"
                  >
                    <h1>Profile</h1>
                    <FaCircleUser size={20} />
                  </NavLink>
                  <div className="w-full h-px bg-gray-300/70 my-2"></div>
                  <li className="flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded hover:bg-gray-500/20 transition">
                    <a href="#">Settings</a>
                    <Settings size={20} />
                  </li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-between gap-3 cursor-pointer px-3 py-2 rounded hover:bg-gray-500/20 transition"
                  >
                    <h1>Logout</h1>
                    <LogOut size={20} />
                  </button>
                  <div className="w-full h-px bg-gray-300/50 my-2"></div>
                </ul>
              </div>
            )}
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-800 truncate max-w-35">
                {currentUser?.name || "User"}
              </span>
              <span
                className={`mt-0.5 inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeStyle}`}
              >
                {badgeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
