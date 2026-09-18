import { useState, useEffect } from "react";
import {
  LuUser,
  LuLock,
  LuBell,
  LuSave,
  LuMail,
  LuPhone,
  LuMapPin,
  LuShieldCheck,
  LuQrCode,
  LuKeyRound,
  LuCheck,
} from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../data/api";

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { currentUser, userData } = useAuth();

  // Separated form states for cleaner payload management
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "Phnom Penh, Cambodia",
    emailNotifications: true,
    pushNotifications: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // OTP / 2FA State Management
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [showOtpSetupModal, setShowOtpSetupModal] = useState(false);
  const [otpVerificationCode, setOtpVerificationCode] = useState("");
  const [otpFeedback, setOtpFeedback] = useState(null);

  // Populate data when userData becomes available from the API response
  useEffect(() => {
    if (userData?.user) {
      setProfileData((prev) => ({
        ...prev,
        fullName: userData.user.name || "",
        email: userData.user.email || "",
        phone: userData.user.teacher?.phone || "",
        emailNotifications: userData.user.email_notifications ?? true,
        pushNotifications: userData.user.push_notifications ?? false,
      }));
      if (userData.user.two_factor_enabled) {
        setIsOtpEnabled(true);
      }
    }
  }, [userData]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. Update Profile & Notifications Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/teacher/profile", profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // 2. Update Password Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      await api.put("/teacher/password", {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.message || "Failed to update password.");
    }
  };

  // 3. Enable 2FA Handler
  const handleVerifyAndEnableOtp = async (e) => {
    e.preventDefault();
    if (otpVerificationCode.length !== 6) {
      setOtpFeedback({ type: "error", text: "Please enter a valid 6-digit OTP code." });
      return;
    }

    try {
      await api.post("/teacher/2fa/enable", { code: otpVerificationCode });
      setIsOtpEnabled(true);
      setShowOtpSetupModal(false);
      setOtpVerificationCode("");
      setOtpFeedback(null);
      alert("Two-Factor Authentication enabled successfully!");
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setOtpFeedback({ type: "error", text: error.response?.data?.message || "Invalid verification code." });
    }
  };

  // 4. Disable 2FA Handler
  const handleDisableOtp = async () => {
    if (window.confirm("Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.")) {
      try {
        await api.post("/teacher/2fa/disable");
        setIsOtpEnabled(false);
        alert("Two-Factor Authentication has been disabled.");
      } catch (error) {
        console.error("Error disabling 2FA:", error);
        alert("Failed to disable 2FA.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <div className="lg:min-w-160 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-bold tracking-tight">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Manage your personal information, security preferences, and notification channels.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation Tabs */}
          <div className="w-full md:w-64 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LuUser size={16} />
              <span>Personal Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <LuLock size={16} />
              <span>Security & Password</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
            
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-base font-bold">Personal Information</h2>
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
                      <LuUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <LuPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Location / Address
                    </label>
                    <div className="relative">
                      <LuMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LuSave size={16} />
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab (Password & OTP) */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-base font-bold">Security & Authentication</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ensure your account is secure using a strong password and two-factor authentication.
                  </p>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Change Password
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
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
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* Two-Factor Authentication (OTP) Section */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Two-Factor Authentication (OTP)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Protect your teacher account with Google Authenticator or any TOTP app.
                      </p>
                    </div>
                    <div>
                      {isOtpEnabled ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800">
                          <LuCheck size={14} /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>

                  {!isOtpEnabled ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                          <LuShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold">Add an extra layer of security</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Requires a 6-digit verification code from your authenticator app upon login.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowOtpSetupModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
                      >
                        Enable OTP
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">OTP protection is active</p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          Your account is protected against unauthorized sign-ins.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDisableOtp}
                        className="px-3.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-rose-50 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Disable OTP
                      </button>
                    </div>
                  )}

                  {/* OTP Setup Modal / Expanded Panel */}
                  {showOtpSetupModal && (
                    <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                          <LuQrCode size={16} /> Set up Authenticator App
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowOtpSetupModal(false)}
                          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        1. Scan the QR code below with your authenticator app, or enter the setup key manually.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-2 shrink-0">
                          <LuQrCode size={36} className="text-slate-400 mb-1" />
                          <span className="text-[10px] text-slate-500 font-mono">MOCK QR CODE</span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">Setup Key / Secret</span>
                          <div className="flex items-center gap-2 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-slate-700 dark:text-slate-300">
                            <LuKeyRound size={14} className="text-blue-500" />
                            <span>JBSWY3DPEHPK3PXP</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          2. Enter the 6-digit code from your app to verify and activate
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpVerificationCode}
                            onChange={(e) => setOtpVerificationCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="123456"
                            className="w-40 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono tracking-widest text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyAndEnableOtp}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Verify & Enable
                          </button>
                        </div>
                        {otpFeedback && (
                          <p className="text-xs text-rose-600 mt-1">{otpFeedback.text}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-base font-bold">Notification Preferences</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose how you want to receive alerts and updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold block">Email Notifications</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Receive daily summary of attendance and system announcements.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={profileData.emailNotifications}
                      onChange={handleProfileChange}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold block">Push Notifications</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Receive instant alerts on your browser when class schedules change.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={profileData.pushNotifications}
                      onChange={handleProfileChange}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LuSave size={16} />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}