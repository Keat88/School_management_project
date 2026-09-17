import { useMemo, useRef, useState, useEffect } from "react";
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
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "../../hooks/LoadingModal";

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-3.5 py-2.5 text-sm md:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs";
const labelClass =
  "block text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

function Field({ label, icon: Icon, className = "", ...props }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 shrink-0"
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
      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/50 shrink-0 shadow-2xs">
        <Icon size={16} className="md:w-4 md:h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
          {label}
        </p>
        <p className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "admin",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    address: "Phnom Penh, Cambodia",
  });

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
  );
  const fileInputRef = useRef(null);

  // Sync profile data dynamically when API response (userData or currentUser) updates
  useEffect(() => {
    const activeUser = userData?.user || currentUser;
    if (activeUser) {
      setProfile({
        name: activeUser.name || "",
        email: activeUser.email || "",
        role: activeUser.role || "admin",
        phone: activeUser.teacher?.phone || activeUser.phone || "",
        gender: activeUser.teacher?.gender || activeUser.gender || "male",
        dateOfBirth: activeUser.dateOfBirth || "",
        address: activeUser.address || "Phnom Penh, Cambodia",
      });
      if (activeUser.avatar) {
        setAvatar(activeUser.avatar);
      }
    }
  }, [userData, currentUser]);

  const memberSince = useMemo(() => {
    const activeUser = userData?.user || currentUser;
    if (activeUser?.created_at) {
      return new Date(activeUser.created_at).getFullYear();
    }
    return "2026";
  }, [userData, currentUser]);

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

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center transition-colors">
        <div className="w-full lg:min-w-160 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Profile Settings
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Manage your personal credentials, workspace security, and
                preferences.
              </p>
            </div>
        
          </div>

          {/* Banner and User Header Card */}
          <div className="rounded-lg bg-white dark:bg-slate-900  border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
              <div className="absolute right-6 top-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
                <Sparkles size={14} className="text-blue-400" />
                <span>Verified Workspace User</span>
              </div>
            </div>
            <div className="px-5 sm:px-8 pb-6 -mt-12 sm:-mt-14">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar Container */}
                <div className="relative shrink-0">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-xl ring-2 ring-slate-900/10 dark:ring-slate-800">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-indigo-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl sm:text-4xl font-bold">
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
                    className="absolute -bottom-1 -right-1 p-2.5 rounded-lg bg-blue-500 text-white shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95 ring-4 ring-white dark:ring-slate-900"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* User Overview */}
                <div className="w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                      {profile.name}
                    </h2>
                    <span className="self-center sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                      <ShieldCheck size={13} className="text-blue-500" />{" "}
                      {profile.role}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
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
              className="rounded-lg bg-white dark:bg-slate-900  border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 lg:col-span-2 space-y-6 transition-colors"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Update your official identity and demographic details.
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

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Contact Details
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  How system alerts and team members can reach you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>

            {/* Sidebar Account Summary */}
            <div className="rounded-lg bg-white dark:bg-slate-900  border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 h-fit space-y-5 transition-colors">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Account Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  System access status & security credentials.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-950/60 px-4 py-3 border border-slate-200/60 dark:border-slate-800">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <Lock size={16} className="text-blue-500 shrink-0" /> Role
                    Level
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-950/60 px-4 py-3 border border-slate-200/60 dark:border-slate-800">
                  <span className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <Calendar size={16} className="text-blue-500 shrink-0" />{" "}
                    Member Since
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {memberSince}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer active:scale-95 shadow-2xs"
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
