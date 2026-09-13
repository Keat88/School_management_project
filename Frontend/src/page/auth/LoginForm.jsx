import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import {
  FaGithub,
  FaGoogle,
  FaUsers,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa6";
import LoadingModal from "../../hooks/LoadingModal";

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
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)]"
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
          — Learnova School System
        </p>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = (next) => {
    if (next !== mode) {
      setMode(next);
      setFeedback(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await AuthApi.Login(formData);
      const token = response.token || response.access_token;
      const user = response.user;
      if (token) {
        localStorage.setItem("token", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        setFeedback({ type: "success", text: "Login successful!" });
        setTimeout(() => {
          if (user?.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/";
          }
        }, 500);
      }
    } catch (error) {
      console.log("Login error:", error);
      setFeedback({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    if (registerData.password !== registerData.password_confirmation) {
      setFeedback({ type: "error", text: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      await AuthApi.Register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.password_confirmation,
      });
      setFeedback({
        type: "success",
        text: "Account created successfully! You can now sign in.",
      });
      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      setTimeout(() => setMode("login"), 1000);
    } catch (error) {
      console.log("Register error:", error);
      setFeedback({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title={mode === "login" ? "Completing login..." : "Creating account..."}
        subtitle={mode === "login" ? "Finalizing your request" : "Setting up your profile"}
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

            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/80 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-xl py-2.5 transition ${
                  mode === "login"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-xl py-2.5 transition ${
                  mode === "register"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Create Account
              </button>
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

            {mode === "login" ? (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Sign in to access your administrative dashboard
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@school.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-50 px-3 text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:8000/api/auth/google/redirect")
                    }
                    className="flex justify-center items-center gap-x-1 py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    <FaGoogle size={18} />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:8000/api/auth/github/redirect")
                    }
                    className="flex justify-center items-center gap-x-1 py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
                  >
                    <FaGithub size={18} />
                    Github
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="mt-8 space-y-5">
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create your account
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Join the school portal and start today
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder="you@school.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Confirm
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={registerData.password_confirmation}
                      onChange={handleRegisterChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}