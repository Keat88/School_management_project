import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import { FaArrowLeft } from "react-icons/fa6";
import LoadingModal from "../../hooks/LoadingModal";

export default function ForgotPassword() {
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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl sm:px-10">
            {feedback && (
              <div
                className={`p-4 mb-6 rounded-2xl text-sm font-medium ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {feedback.text}
              </div>
            )}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-between items-center mb-6">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
                >
                  <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  Back to sign in
                </Link>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-4 font-bold text-2xl">
                  SM
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Forgot Password
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your registered email to receive a verification code
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@school.edu"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending Code..." : "Send OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
