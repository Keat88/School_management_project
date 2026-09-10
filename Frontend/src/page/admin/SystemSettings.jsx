import { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Bell,
  BookOpen,
  Save,
  CheckCircle,
} from "lucide-react";
import { api } from "../../data/api";

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    schoolName: "",
    academicYear: "",
    emailAlerts: true,
    smsGateway: false,
    twoFactorAuth: false,
    sessionTimeout: "30",
    gradingScale: "percentage",
    libraryMaxBooks: "5",
  });

  // Fetch saved settings from Laravel backend on component mount
  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        if (res.data.status === "success" && res.data.settings) {
          const fetched = res.data.settings;
          setSettings({
            schoolName: fetched.schoolName || "",
            academicYear: fetched.academicYear || "",
            emailAlerts: fetched.emailAlerts === "true" || fetched.emailAlerts === true,
            smsGateway: fetched.smsGateway === "true" || fetched.smsGateway === true,
            twoFactorAuth: fetched.twoFactorAuth === "true" || fetched.twoFactorAuth === true,
            sessionTimeout: fetched.sessionTimeout || "30",
            gradingScale: fetched.gradingScale || "percentage",
            libraryMaxBooks: fetched.libraryMaxBooks || "5",
          });
        }
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/settings", { settings });
      if (response.data.status === "success") {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };
  return (
    <div className="space-y-6 max-w-5xl lg:min-w-160 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="text-blue-600" size={22} />
            System Settings & Control Panel
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage core configurations, communication preferences, and security
            controls for your Student Management System.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 text-xs font-medium animate-fade-in">
            <CheckCircle size={14} />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "general"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings size={16} />
            General Setup
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "notifications"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bell size={16} />
            Notifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "security"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Shield size={16} />
            Security & Access
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "academic"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen size={16} />
            Academic & Library
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs"
          >
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                  General School Information
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => handleChange("schoolName", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Current Academic Year
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) =>
                      handleChange("academicYear", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                  Notification Preferences
                </h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Email Alerts
                    </p>
                    <p className="text-xs text-slate-500">
                      Send automatic emails for announcements and fee reminders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) =>
                      handleChange("emailAlerts", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      SMS Gateway Integration
                    </p>
                    <p className="text-xs text-slate-500">
                      Broadcast text alerts for urgent school closures or
                      notices.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsGateway}
                    onChange={(e) =>
                      handleChange("smsGateway", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                  Security & Authentication
                </h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Require Two-Factor Auth (2FA)
                    </p>
                    <p className="text-xs text-slate-500">
                      Enforce 2FA for administrative and staff login accounts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleChange("twoFactorAuth", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Session Timeout (Minutes)
                  </label>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleChange("sessionTimeout", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-white"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
                  Academic & Library Rules
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grading Calculation Scale
                  </label>
                  <select
                    value={settings.gradingScale}
                    onChange={(e) =>
                      handleChange("gradingScale", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 bg-white"
                  >
                    <option value="percentage">Percentage (0 - 100%)</option>
                    <option value="gpa">GPA Scale (0.0 - 4.0)</option>
                    <option value="letter">Letter Grade (A-F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Max Books Borrowable per Student
                  </label>
                  <input
                    type="number"
                    value={settings.libraryMaxBooks}
                    onChange={(e) =>
                      handleChange("libraryMaxBooks", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}