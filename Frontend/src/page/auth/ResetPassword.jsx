import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import {
  FaKey,
  FaShieldHalved,
  FaLockOpen,
  FaCheckDouble,
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
          You're almost{" "}
          <span className="text-cyan-300">back in control.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/85">
          Choose a strong, new password for your account. Make sure it's one
          you haven't used before.
        </p>

        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaShieldHalved className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">At Least 8 Characters</p>
              <p className="text-xs text-blue-100/70">
                Longer is always safer for your account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaCheckDouble className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Confirm Your Password</p>
              <p className="text-xs text-blue-100/70">
                Both fields must match exactly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaLockOpen className="text-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-semibold">Unlock Your Dashboard</p>
              <p className="text-xs text-blue-100/70">
                Sign in with your new password right after
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
                <FaKey size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Set a new password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please choose a secure password with at least 8 characters
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}