import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  User,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "../../hooks/LoadingModal";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm md:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white transition-shadow";
const labelClass = "block text-xs md:text-sm font-medium text-gray-600 mb-1.5";
function Field({ label, icon: Icon, className = "", ...props }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0"
          />
        )}
        <input className={`${inputClass} ${Icon ? "pl-10" : ""}`} {...props} />
      </div>
    </div>
  );
}
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
        <Icon size={16} className="md:w-4 md:h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-xs md:text-sm font-medium text-gray-700 truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: currentUser?.name || "keatKun",
    email: currentUser?.email || "keatkeng88@gmail.com",
    role: currentUser?.role || "admin",
    phone: currentUser?.phone || "+855 12 345 678",
    gender: currentUser?.gender || "Male",
    dateOfBirth: currentUser?.dateOfBirth || "1990-05-14",
    address: currentUser?.address || "Phnom Penh, Cambodia",
  });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(
    currentUser?.avatar ||
      "https://lh3.googleusercontent.com/a/ACg8ocLPO8sg7GWU0UKg5p2zCTmCl7Zoexg9yfy-hv58__FvEGdGqZ0=s96-c",
  );
  const fileInputRef = useRef(null);
  const memberSince = useMemo(() => {
    if (currentUser?.created_at) {
      return new Date(currentUser.created_at).getFullYear();
    }
    return "2026";
  }, [currentUser?.created_at]);

  const avatarInitial = useMemo(
    () => (profile.name || "K").trim().charAt(0).toUpperCase(),
    [profile.name],
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleSave = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const handleLogOut = () => {
    try {
      setLoading(true);
      logout();
      navigate("/");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {
        <LoadingModal
          isOpen={loading}
          title="Completing Logout..."
          subtitle="Finalizing your request"
        />
      }

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center p-3 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl lg:min-w-160 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Edit Profile
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage your personal information and account settings
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogOut}
              className="self-start sm:self-auto inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Banner and User Header Card */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-24 sm:h-32 md:h-40 bg-gradient-to-r from-blue-500 via-indigo-600 to-slate-400" />
            <div className="px-4 sm:px-6 pb-6 -mt-12 sm:-mt-14">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                {/* Avatar Container */}
                <div className="relative shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/5">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold">
                        {avatarInitial}
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    aria-label="Change photo"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700  transition-colors cursor-pointer active:scale-95"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* User Overview */}
                <div className="w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                      {profile.name}
                    </h2>
                    <span className="self-center sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-600 border border-blue-100">
                      <User size={12} /> {profile.role}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t sm:border-t-0 border-gray-100">
                    <InfoItem icon={Mail} label="Email" value={profile.email} />
                    <InfoItem
                      icon={Phone}
                      label="Phone"
                      value={profile.phone}
                    />
                    <InfoItem
                      icon={MapPin}
                      label="Location"
                      value={profile.address}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form */}
            <form
              onSubmit={handleSave}
              className="rounded-2xl bg-white shadow-sm border border-gray-200 p-4 sm:p-6 lg:col-span-2 space-y-5 sm:space-y-6"
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Personal Information
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Update your basic personal details below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Field
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2 md:col-span-1"
                />
                <Field
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2 md:col-span-1">
                  <label className={labelClass}>Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 pb-1">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    icon={Phone}
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3 sm:mt-4">
                  <label className={labelClass}>Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    value={profile.address}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-start gap-3 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer active:scale-95"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
            {/* Sidebar Account Summary */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-4 sm:p-6 h-fit space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Account Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Overview of your account settings.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-3 border border-gray-100">
                  <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Lock size={16} className="text-gray-400 shrink-0" /> Role
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 capitalize">
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-3 border border-gray-100">
                  <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <User size={16} className="text-gray-400 shrink-0" /> Member
                    since
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    {memberSince}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors cursor-pointer active:scale-95"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
