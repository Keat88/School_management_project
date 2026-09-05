import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {feedback && (
            <div
              className={`p-4 mb-6 rounded-lg text-sm font-medium ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
            >
              {feedback.text}
            </div>
          )}
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-3 font-bold text-xl">
              SM
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Verify OTP
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-slate-700">{email}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="123456"
                className="w-full px-3.5 py-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-xs font-medium">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-500"
            >
              &larr; Change Email
            </Link>
            {countdown > 0 ? (
              <span className="text-slate-400">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-500 font-semibold"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
