import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";

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
              Forgot Password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your registered email to receive a verification code
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@school.edu"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-blue-600 hover:text-blue-500"
            >
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
