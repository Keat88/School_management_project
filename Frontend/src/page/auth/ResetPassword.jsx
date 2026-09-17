import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import {
  FaGithub,
  FaGoogle,
  FaUsers,
  FaClipboardCheck,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa6";
import LoadingModal from "../../hooks/LoadingModal";
import { useAuth } from "../../context/AuthContext";
import { PiStudentFill } from "react-icons/pi";

function BrandPanel() {
  const { SchoolName } = useAuth();
  return (
    <div className="relative hidden lg:flex w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 px-12 py-10 text-white">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)]"
      />

      <div className="relative flex items-center gap-3">
        <div className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
          <PiStudentFill />
        </div>
        <div>
          <p className="text-lg font-bold leading-none tracking-tight">
            {SchoolName?.schoolName || "School Management"}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            {SchoolName?.academicYear || "Academic Portal"}
          </p>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-4xl font-bold leading-tight">
          Run every part of your school{" "}
          <span className="text-cyan-300">from one dashboard.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/85">
          Students, teachers, classes, attendance, payments and reports —
          everything you need for smarter education management.
        </p>

        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaUsers className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Student & Teacher Records</p>
              <p className="text-xs text-blue-100/70">
                Organized profiles in one central place
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaClipboardCheck className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Attendance & Scores</p>
              <p className="text-xs text-blue-100/70">
                Track classes, marks and progress daily
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaChartLine className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Payments & Reports</p>
              <p className="text-xs text-blue-100/70">
                Insights and finances at a glance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
        <p className="text-sm italic leading-relaxed text-blue-50/90">
          “Empowering education through smarter management.”
        </p>
        <p className="mt-2 text-xs font-semibold tracking-wide text-cyan-300">
          {SchoolName?.schoolName || "School Management"}
        </p>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setFeedback({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const response = await AuthApi.ResetNewPassword({
        email,
        otp,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setFeedback({
        type: "success",
        text:
          response?.message || "Password successfully reset! Redirecting...",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to reset password. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Resetting password..."
        subtitle="Updating your credentials securely"
      />
      <div className="flex min-h-screen bg-slate-50">
        <BrandPanel />

        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold shadow-md">
                SM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                School Management
              </span>
            </div>

            <div className="mb-6">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
              >
                <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                Back to forgot password
              </Link>
            </div>

            {feedback && (
              <div
                className={`mt-5 p-4 rounded-xl text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Set New Password
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Please choose a secure password with at least 8 characters
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
