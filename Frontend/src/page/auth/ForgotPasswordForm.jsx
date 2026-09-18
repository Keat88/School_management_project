import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="relative hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 px-8 lg:px-12 py-10 text-white shrink-0 transition-colors">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/30 dark:bg-cyan-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-500/30 dark:bg-blue-600/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)]"
      />

      <div className="relative flex items-center gap-3">
        <div className="bg-blue-600 dark:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
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

      <div className="relative my-auto py-8">
        <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
          Run every part of your school{" "}
          <span className="text-cyan-300 dark:text-cyan-400">from one life.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/85">
          {/* Students, teachers, classes, attendance, payments and reports —
          everything you need for smarter education management. */}
          Improve skill with us
        </p>

        <div className="mt-8 xl:mt-10 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-white/5 ring-1 ring-white/20 dark:ring-white/10">
              <FaUsers className="text-cyan-300 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Student & Teacher Records</p>
              <p className="text-xs text-blue-100/70">
                Organized profiles in one central place
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-white/5 ring-1 ring-white/20 dark:ring-white/10">
              <FaClipboardCheck className="text-cyan-300 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Attendance & Scores</p>
              <p className="text-xs text-blue-100/70">
                Track classes, marks and progress daily
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-white/5 ring-1 ring-white/20 dark:ring-white/10">
              <FaChartLine className="text-cyan-300 dark:text-cyan-400" />
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

      <div className="relative rounded-2xl bg-white/10 dark:bg-white/5 p-5 ring-1 ring-white/20 dark:ring-white/10 backdrop-blur">
        <p className="text-sm italic leading-relaxed text-blue-50/90">
          “Empowering education through smarter management.”
        </p>
        <p className="mt-2 text-xs font-semibold tracking-wide text-cyan-300 dark:text-cyan-400">
          {SchoolName?.schoolName || "School Management"}
        </p>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const { SchoolName } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await AuthApi.forSendOtp({
        email: email,
      });
      setFeedback({ type: "success", text: response?.message });
      setTimeout(() => {
        navigate("/forgot-password-verify", { state: { email } });
      }, 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          "Email not found or failed to send OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Sending verification code..."
        subtitle="Please wait while we send your OTP"
      />
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors">
        <BrandPanel />

        <div className="flex flex-1 items-center justify-center px-4 sm:px-8 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="bg-blue-600 dark:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                <PiStudentFill />
              </div>
              <p className="text-lg font-bold leading-none text-slate-900 dark:text-slate-100">
                {SchoolName?.schoolName || "School Management"}
              </p>
            </div>

            {feedback && (
              <div
                className={`mt-5 p-4 rounded-xl text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Forgot Password
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter your registered email to receive a verification code
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@school.edu"
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending Code..." : "Send OTP"}
              </button>
            </form>
            <div className="flex justify-center pt-15">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors group"
              >
                <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}