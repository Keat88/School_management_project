import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Dormitory", path: "/dormitory" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3 focus:outline-none">
          <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center font-bold shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 tracking-tight leading-none">
              Learnova
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Learn. Grow. Succeed.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search & Auth Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-gray-50 border border-gray-200 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:border-blue-600 w-60 transition"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <Link
            to="/login"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-purple-700 transition shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center space-x-3">
          <Link to="/login" className="text-xs font-medium text-gray-700">
            Log In
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 focus:outline-none p-1"
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
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100 space-y-2 text-sm font-medium text-gray-600 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 hover:bg-purple-50 hover:text-blue-600 rounded-lg transition"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 px-1">
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-blue-600 text-white py-2 rounded-xl font-medium shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
