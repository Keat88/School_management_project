import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaSearch,
} from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { FaGauge } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";
import LoadingModal from "../../hooks/LoadingModal";
import { AuthApi } from "../../data/AuthApi";
import { api } from "../../data/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [schoolName, setSchoolName] = useState([]);
  // Destructure user and token from your AuthContext to make the navbar reactive
  const { logout, currentUser, token: contextToken } = useAuth();

  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fallback to local storage if context hasn't populated them yet
  const user =
    currentUser || JSON.parse(localStorage.getItem("user") || "null");
  const token = contextToken || localStorage.getItem("token");
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await AuthApi.Logout();
      const data = response?.data || response;
      if (data?.status === "success" || response) {
        logout();
      }
    } catch (error) {
      console.log("Logout Error:", error);
    } finally {
      setDropdown(false);
      navigate("/login", { replace: true });
    }
  };

  const handleUserProfile = () => {
    navigate("/user-profile");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Dormitory", path: "/dormitory" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "teacher") return "/teacher/dashboard";
    return null;
  };
  const currentDashboard = getDashboardPath();
  useEffect(() => {
    const fetchNameSchool = async () => {
      try {
        const res = await api.get("/settings");
        setSchoolName(res?.data?.settings);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchNameSchool();
  }, []);
  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Completing login..."
        subtitle="Finalizing your request"
      />
      <nav className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center space-x-3 focus:outline-none min-w-0"
          >
            <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
             <PiStudentFill/>
            </div>
            <div className="truncate">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none block truncate">
                {schoolName.schoolName}
              </span>
              <p className="text-[10px] text-gray-400 dark:text-slate-400 mt-0.5 hidden xs:block">
                Learn. Grow. Succeed.
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-bold text-gray-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search, Theme Toggle & Auth Actions / Profile Dropdown (Desktop/Tablet) */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Responsive Search Input */}
            <div className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm text-gray-900 dark:text-slate-100 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-500 w-48 lg:w-60 transition"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                <FaSearch className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition border border-gray-200 dark:border-slate-800 focus:outline-none shadow-sm flex items-center justify-center shrink-0"
            >
              {isDarkMode ? (
                <FaSun className="w-4 h-4 text-gray-400" />
              ) : (
                <FaMoon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {token ? (
              <div className="flex items-center space-x-2 lg:space-x-3">
                {currentDashboard && (
                  <Link
                    to={currentDashboard}
                    className="bg-slate-900 dark:bg-slate-800 text-white text-xs lg:text-sm font-medium px-3 lg:px-4 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm flex items-center gap-1.5 shrink-0"
                  >
                    <FaGauge className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="flex items-center space-x-2 focus:outline-none bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition border border-gray-200 dark:border-slate-800 max-w-[160px]"
                  >
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-inner shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-xs lg:text-sm font-semibold text-gray-700 dark:text-slate-200 truncate pr-1 hidden sm:inline">
                      {user?.name || "Account"}
                    </span>
                    <FaChevronDown
                      className={`w-3 h-3 text-gray-500 dark:text-slate-400 transition-transform shrink-0 ${
                        dropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Modal */}
                  {dropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-800">
                        <p className="text-xs text-gray-400 dark:text-slate-400">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdown(false);
                          handleUserProfile();
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 transition text-left"
                      >
                        <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Your Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition text-left"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm shrink-0"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Actions Header */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition border border-gray-200 dark:border-slate-800 focus:outline-none"
            >
              {isDarkMode ? (
                <FaSun className="w-4 h-4 text-amber-400" />
              ) : (
                <FaMoon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-600 dark:text-slate-300 focus:outline-none p-1.5"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2 text-sm font-medium text-gray-600 dark:text-slate-300 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition"
              >
                {link.name}
              </Link>
            ))}
            {token ? (
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-1">
                {currentDashboard && (
                  <Link
                    to={currentDashboard}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-3 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleUserProfile();
                  }}
                  className="w-full text-left py-2 px-3 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition"
                >
                  Your Profile
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left py-2 px-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 px-1 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 py-2 rounded-xl font-medium shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-blue-600 text-white py-2 rounded-xl font-medium shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
