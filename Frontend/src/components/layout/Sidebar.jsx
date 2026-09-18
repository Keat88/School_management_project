import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { sidebarMenu, sidebarTeacherMenu } from "../../data/sideBar";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { AuthApi } from "../../data/AuthApi";
import LoadingModal from "../../hooks/LoadingModal";
import { IoSchool } from "react-icons/io5";
import { api } from "../../data/api";
import { PiStudentFill } from "react-icons/pi";

function Sidebar() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const { SchoolName } = useAuth();
  const userAvata = localStorage.getItem("userAvatar");
  // Dark/Light mode state initialized from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  // Apply or remove 'dark' class on root document and persist preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const currentSidebar =
    currentUser?.role === "admin" ? sidebarMenu : sidebarTeacherMenu;
  const visibleMenu = currentSidebar.filter((menu) =>
    menu.roles?.includes(currentUser?.role),
  );
  const closeMobile = () => setIsMobileOpen(false);
  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      if (AuthApi.Logout) {
        await AuthApi.Logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userAvatar");
      window.location.href = "/login";
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
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 z-30 transition-colors">
        <span className="text-xl font-bold flex flex-col text-gray-800 dark:text-white">
          {SchoolName && (
            <div className="flex gap-x-1 items-center">
              <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                <PiStudentFill />
              </div>
              <span className="text-blue-600 dark:text-blue-400">
                {SchoolName?.schoolName || "Etec Technology"}
              </span>
            </div>
          )}
          <p className="text-gray-500 text-sm font-medium">
            school management system
          </p>
        </span>
        <div className="flex items-center gap-x-1">
          {/* Mobile Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col
          fixed md:sticky top-0 left-0 h-screen z-50
          w-64 shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[73px] border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl flex flex-col font-bold text-gray-800 dark:text-white">
            {SchoolName && (
              <div className="flex gap-x-1 items-center">
                <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                  <PiStudentFill />
                </div>
                <span className="text-blue-600 max-md:text-sm dark:text-blue-400">
                  {SchoolName?.schoolName || "Etec Technology"}
                </span>
              </div>
            )}
            <p className="text-gray-500 text-sm font-medium">
              school management system
            </p>
          </span>
          <div className="flex items-center gap-x-1">
            <button
              type="button"
              onClick={closeMobile}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {visibleMenu.map((menu) => {
              const Icon = menu.icon || (() => null);
              const hasChildren = menu.child && menu.child.length > 0;
              const isDropdownOpen = openDropdown === menu.id;
              if (hasChildren) {
                return (
                  <li key={menu.id} className="space-y-1 relative">
                    <div
                      onClick={() => toggleDropdown(menu.id)}
                      className="w-full group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                        />
                        <span>{menu.title}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 text-gray-400 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {isDropdownOpen && (
                      <ul className="pl-9 space-y-1 py-1 bg-white dark:bg-gray-900">
                        {menu.child.map((childItem) => {
                          const IconChildren = childItem.icon;
                          return (
                            <li key={childItem.path}>
                              <NavLink
                                to={childItem.path}
                                onClick={closeMobile}
                                className={({ isActive }) =>
                                  `flex gap-x-1.5 items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                    isActive
                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                  }`
                                }
                              >
                                {IconChildren && <IconChildren size={16} />}
                                {childItem.title || childItem.titile}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={menu.id}>
                  <NavLink
                    to={menu.path || ""}
                    onClick={() => {
                      closeMobile();
                      setOpenDropdown(null);
                    }}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600 transition-opacity ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <Icon
                          size={18}
                          className={
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                          }
                        />
                        <span>{menu.title}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / user info */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold uppercase">
              {userAvata ? (
                <img
                  src={userAvata}
                  alt={userAvata}
                  className="rounded-full w-full"
                />
              ) : (
                currentUser?.name?.charAt(0) || "U"
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {currentUser?.role || "guest"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
