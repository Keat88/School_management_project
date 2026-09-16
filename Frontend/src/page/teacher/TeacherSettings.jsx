import { useState } from "react";
import {
  LuUser,
  LuLock,
  LuBell,
  LuSave,
  LuShield,
  LuMail,
  LuPhone,
  LuMapPin,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    fullName: "Keng Keat",
    email: "keatkeng88@gmail.com",
    phone: "+855 12 345 678",
    address: "Phnom Penh, Cambodia",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: false,
  });
  const { currentUser } = useAuth();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Settings updated successfully!");
  };
  console.log(currentUser)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950  font-sans text-slate-800 dark:text-slate-100">
      <div className="lg:min-w-160 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold tracking-tight">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Manage your personal information, security preferences, and
            notification channels.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation Tabs */}
          <div className="w-full md:w-64 space-x-0.5 space-y-1 max-md:flex max-md:overflow-x-scroll">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 max-md:px-2 max-md:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LuUser size={16} />
              <span>Personal Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 max-md:px-2 max-md:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LuLock size={16} />
              <span>Security & Password</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg max-md:px-2 max-md:py-1 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LuBell size={16} />
              <span>Notifications</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <form onSubmit={handleSubmit}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-base font-bold">
                      Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Update your identity and contact details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <LuUser
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <LuMail
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <LuPhone
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Location / Address
                      </label>
                      <div className="relative">
                        <LuMapPin
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-base font-bold">Change Password</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ensure your account is using a secure password.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-base font-bold">
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Choose how you want to receive alerts and updates.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold block">
                          Email Notifications
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Receive daily summary of attendance and system
                          announcements.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold block">
                          Push Notifications
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Receive instant alerts on your browser when class
                          schedules change.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LuSave size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
