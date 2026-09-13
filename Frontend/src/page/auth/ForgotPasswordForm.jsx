import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import {
  FaEnvelope,
  FaShieldHalved,
  FaRightToBracket,
} from "react-icons/fa6";

function BrandPanel() {
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

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-lg font-extrabold text-blue-700 shadow-lg">
          SM
        </div>
        <div>
          <p className="text-lg font-bold leading-none tracking-tight">
            School Management
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/80">
            Admin Portal
          </p>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-4xl font-bold leading-tight">
          Account recovery{" "}
          <span className="text-cyan-300">in just a few clicks.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/85">
          We'll send a secure code to your email so you can get back into your
          dashboard quickly and safely.
        </p>

        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaShieldHalved className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Secure Verification</p>
              <p className="text-xs text-blue-100/70">
                One-time codes sent straight to your inbox
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaEnvelope className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Instant Delivery</p>
              <p className="text-xs text-blue-100/70">
                No waiting around — receive your code in seconds
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaRightToBracket className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Back in Minutes</p>
              <p className="text-xs text-blue-100/70">
                Reset your password and resume work fast
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
          — Learnova School System
        </p>
      </div>
    </div>
  );
}

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

          {feedback && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {feedback.text}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FaEnvelope size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Don't worry — enter your registered email and we'll send you a
                verification code to reset it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
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
    </div>
  );
}