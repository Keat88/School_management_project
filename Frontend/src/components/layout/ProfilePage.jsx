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
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm md:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all";
const labelClass =
  "block text-xs md:text-sm font-semibold text-slate-700 mb-1.5";

function Field({ label, icon: Icon, className = "", ...props }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0"
          />
        )}
        <input className={`${inputClass} ${Icon ? "pl-11" : ""}`} {...props} />
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/60 shrink-0 shadow-2xs">
        <Icon size={16} className="md:w-4 md:h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-xs md:text-sm font-medium text-slate-700 truncate">
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
    name: currentUser?.name || "Keat Kun",
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
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
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
      console.error("Error", error);
    } finally {
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

      <div className="min-h-screen bg-slate-100/60 flex justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Profile Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your personal information and security preferences
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogOut}
              className="self-start sm:self-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Banner and User Header Card */}
          <div className="rounded-3xl bg-white shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="h-28 sm:h-36 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/1og via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="px-5 sm:px-8 pb-6 -mt-12 sm:-mt-14">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar Container */}
                <div className="relative shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white p-1 shadow-md ring-1 ring-slate-900/10">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl sm:text-4xl font-bold">
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
                    className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-all cursor-pointer active:scale-95"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* User Overview */}
                <div className="w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                      {profile.name}
                    </h2>
                    <span className="self-center sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <User size={12} /> {profile.role}
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <form
              onSubmit={handleSave}
              className="rounded-3xl bg-white shadow-xs border border-slate-200/80 p-5 sm:p-8 lg:col-span-2 space-y-6"
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Personal Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Update your identity and demographic information.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2"
                />
                <Field
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                />
                <div>
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

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    icon={Mail}
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    icon={Phone}
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4">
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

              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>

            {/* Sidebar Account Summary */}
            <div className="rounded-3xl bg-white shadow-xs border border-slate-200/80 p-5 sm:p-6 h-fit space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Account Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  System access status and security.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200/60">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                    <Lock size={16} className="text-slate-400 shrink-0" /> Role
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 capitalize">
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200/60">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                    <User size={16} className="text-slate-400 shrink-0" />{" "}
                    Member since
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {memberSince}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer active:scale-95 shadow-2xs"
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
