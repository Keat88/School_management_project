import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaSave, FaShieldAlt, FaCamera } from "react-icons/fa";
import { api } from "../../data/api";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { currentUser, setCurrentUser } = useAuth();
  
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const user = currentUser || storedUser;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await api.put("/profile", {
        name: formData.name,
        email: formData.email,
      });
      const updatedUser = response?.data?.user || { ...user, name: formData.name, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setCurrentUser) setCurrentUser(updatedUser);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/password", {
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password. Check your current password.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Manage your profile information, account preferences, and security settings.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-3xl font-bold shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <button 
              type="button" 
              aria-label="Change avatar"
              className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-full shadow-md hover:bg-gray-50 transition border border-gray-200 dark:border-slate-700"
            >
              <FaCamera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold truncate">{user?.name || "User Name"}</h2>
            <p className="text-blue-100 text-sm mt-0.5 truncate">{user?.email || "user@example.com"}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full uppercase tracking-wider">
              Role: {user?.role || "Student"}
            </span>
          </div>
        </div>

        {/* Tabs Navigation (Horizontally scrollable on small screens) */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => { setActiveTab("general"); setMessage({ type: "", text: "" }); }}
            className={`py-4 px-4 font-medium text-sm border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "general"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            <FaUser className="w-4 h-4 shrink-0" />
            <span>General Information</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("security"); setMessage({ type: "", text: "" }); }}
            className={`py-4 px-4 font-medium text-sm border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "security"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            }`}
          >
            <FaShieldAlt className="w-4 h-4 shrink-0" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Feedback Alert Message */}
        {message.text && (
          <div
            className={`mx-4 sm:mx-6 mt-6 p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Content: General Information */}
        {activeTab === "general" && (
          <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <FaUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FaSave className="w-4 h-4" />
                <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab Content: Security */}
        {activeTab === "security" && (
          <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <FaLock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <FaSave className="w-4 h-4" />
                <span>{loading ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}