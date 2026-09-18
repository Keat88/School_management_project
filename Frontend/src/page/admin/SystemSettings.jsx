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
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    api
      .get("/settings")
      .then((res) => {
        if (res.data.status === "success" && res.data.settings) {
          const fetched = res.data.settings;
          setSettings({
            schoolName: fetched.schoolName || "",
            academicYear: fetched.academicYear || "",
            emailAlerts:
              fetched.emailAlerts === "true" || fetched.emailAlerts === true,
            smsGateway:
              fetched.smsGateway === "true" || fetched.smsGateway === true,
            twoFactorAuth:
              fetched.twoFactorAuth === "true" ||
              fetched.twoFactorAuth === true,
            sessionTimeout: fetched.sessionTimeout || "30",
            gradingScale: fetched.gradingScale || "percentage",
            libraryMaxBooks: fetched.libraryMaxBooks || "5",
          });
        }
      })
      .finally(setLoading(false))
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
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading your report...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6  lg:min-w-160 mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Settings className="text-blue-500 dark:text-blue-500" size={22} />
            System Settings & Control Panel
          </h2>
          <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
            Manage core configurations, communication preferences, and security
            controls for your Student Management System.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20 animate-fade-in">
            <CheckCircle size={14} />
            Settings saved successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 flex max-md:flex-row max-md:overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0">
          {[
            { id: "general", label: "General Setup", icon: Settings },
            { id: "notifications", label: "Notifications", icon: Bell },
            // { id: "security", label: "Security & Access", icon: Shield },
            { id: "academic", label: "Academic & Library", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 md:w-full whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        {/* Content Area */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSave}
            className="rounded-lg border p-6 space-y-6 shadow-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          >
            {activeTab === "general" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-3 text-slate-900 dark:text-slate-100 border-slate-100 dark:border-slate-800">
                  General School Information
                </h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => handleChange("schoolName", e.target.value)}
                    placeholder="Enter institution name"
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                    Current Academic Year
                  </label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) =>
                      handleChange("academicYear", e.target.value)
                    }
                    placeholder="e.g. 2026-2027"
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-3 text-slate-900 dark:text-slate-100 border-slate-100 dark:border-slate-800">
                  Notification Preferences
                </h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Email Alerts
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Send automatic emails for announcements and fee reminders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) =>
                      handleChange("emailAlerts", e.target.checked)
                    }
                    className="w-4 h-4 rounded cursor-pointer text-blue-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      SMS Gateway Integration
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    className="w-4 h-4 rounded cursor-pointer text-blue-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-3 text-slate-900 dark:text-slate-100 border-slate-100 dark:border-slate-800">
                  Security & Authentication
                </h3>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Require Two-Factor Auth (2FA)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enforce 2FA for administrative and staff login accounts.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleChange("twoFactorAuth", e.target.checked)
                    }
                    className="w-4 h-4 rounded cursor-pointer text-blue-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                    Session Timeout (Minutes)
                  </label>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleChange("sessionTimeout", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-blue-500"
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
                <h3 className="text-base font-semibold border-b pb-3 text-slate-900 dark:text-slate-100 border-slate-100 dark:border-slate-800">
                  Academic & Library Rules
                </h3>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                    Grading Calculation Scale
                  </label>
                  <select
                    value={settings.gradingScale}
                    onChange={(e) =>
                      handleChange("gradingScale", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (0 - 100%)</option>
                    <option value="gpa">GPA Scale (0.0 - 4.0)</option>
                    <option value="letter">Letter Grade (A-F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                    Max Books Borrowable per Student
                  </label>
                  <input
                    type="number"
                    value={settings.libraryMaxBooks}
                    onChange={(e) =>
                      handleChange("libraryMaxBooks", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-4 border-t flex justify-end border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
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
