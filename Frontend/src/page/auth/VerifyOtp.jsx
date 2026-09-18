import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import { FaShieldHalved, FaArrowLeft, FaRotateRight } from "react-icons/fa6";
import LoadingModal from "../../hooks/LoadingModal";
import { useAuth } from "../../context/AuthContext";
import { PiStudentFill } from "react-icons/pi";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const { SchoolName } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await AuthApi.forVerifyOtp({ email, otp });

      setFeedback({
        type: "success",
        text: response?.message || "OTP verified successfully!",
      });

      setTimeout(() => {
        navigate("/forgot-password-reset", { state: { email, otp } });
      }, 800);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Invalid or expired OTP code.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setFeedback(null);
    try {
      const response = await AuthApi.forSendOtp({ email });
      setFeedback({
        type: "success",
        text: response?.message || "New OTP sent successfully.",
      });
      setCountdown(60);
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Failed to resend OTP.",
      });
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Verifying code..."
        subtitle="Please wait while we verify your security code"
      />
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden transition-colors">
        {/* Decorative background blur blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/10 dark:bg-indigo-600/10 blur-3xl pointer-events-none"
        />

        <div className="w-full max-w-md">
          {/* Brand / Logo Header */}
          <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl relative transition-colors">
            <div className="mb-6 flex items-center justify-center gap-2">
              <div className="bg-blue-600 dark:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                <PiStudentFill />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {SchoolName?.schoolName || "School Management"}
              </span>
            </div>

            {/* Icon Badge */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 mb-5 ring-8 ring-blue-50/50 dark:ring-blue-950/40">
              <FaShieldHalved size={26} />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Security Verification
              </h2>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter the 6-digit verification code sent to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">
                  {email}
                </span>
              </p>
            </div>

            {feedback && (
              <div
                className={`p-4 mb-6 rounded-xl text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="000000"
                    className="w-full px-4 py-3.5 border border-slate-300 dark:border-slate-800 rounded-xl text-center text-3xl tracking-[0.4em] font-bold text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>
                <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                  Code expires shortly. Enter numbers only.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Verifying code..." : "Verify Code"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
              >
                <FaArrowLeft size={11} />
                Change Email
              </Link>

              {countdown > 0 ? (
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  Resend in{" "}
                  <strong className="font-semibold text-slate-600 dark:text-slate-300">
                    {countdown}s
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition cursor-pointer"
                >
                  <FaRotateRight size={11} />
                  Resend Code
                </button>
              )}
            </div>
          </div>

          {/* Footer Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}