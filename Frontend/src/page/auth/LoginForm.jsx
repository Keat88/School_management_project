import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [cooldown, setCooldown] = useState(0);

  // Rate limit cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

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
    if (cooldown > 0) return;
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
      if (error.response?.status === 429) {
        setCooldown(30); // 20 seconds cooldown lockout
        setFeedback({
          type: "error",
          text: "Too many login attempts. Please wait 20 seconds before trying again.",
        });
      } else {
        setFeedback({
          type: "error",
          text:
            error.response?.data?.message ||
            error.message ||
            "Invalid email or password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
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
      if (error.response?.status === 429) {
        setCooldown(20);
        setFeedback({
          type: "error",
          text: "Too many requests. Please wait 30 seconds before trying again.",
        });
      } else {
        setFeedback({
          type: "error",
          text:
            error.response?.data?.message || "Registration failed. Try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const { SchoolName } = useAuth();
  return (
    <>
      <LoadingModal
        isOpen={loading}
        title={mode === "login" ? "Completing login..." : "Creating account..."}
        subtitle={
          mode === "login"
            ? "Finalizing your request"
            : "Setting up your profile"
        }
      />
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors">
        <BrandPanel />

        <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-8 sm:py-12">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-md">
            <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold shadow-md">
                SM
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {SchoolName?.schoolName || "School Management"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 p-1 text-sm font-semibold border border-slate-300/50 dark:border-slate-800">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-xl py-2.5 transition ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-cyan-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-xl py-2.5 transition ${
                  mode === "register"
                    ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-cyan-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
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

            {mode === "login" ? (
              <form
                onSubmit={handleSubmit}
                className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Welcome back
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Sign in to access your administrative dashboard
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@school.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 transition"
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
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0
                    ? `Please wait (${cooldown}s)`
                    : loading
                      ? "Signing in..."
                      : "Sign in"}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-50 dark:bg-slate-950 px-3 text-slate-400 dark:text-slate-500">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:8000/api/auth/google/redirect")
                    }
                    className="flex justify-center items-center gap-x-2 py-2.5 px-4 border border-slate-300 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        "http://localhost:8000/api/auth/github/redirect")
                    }
                    className="flex justify-center items-center gap-x-2 py-2.5 px-4 border border-slate-300 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <FaGithub size={18} />
                    Github
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleRegister}
                className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Create your account
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Join the school portal and start today
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    placeholder="you@school.edu"
                    className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Confirm
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={registerData.password_confirmation}
                      onChange={handleRegisterChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-950 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0
                    ? `Please wait (${cooldown}s)`
                    : loading
                      ? "Creating..."
                      : "Create Account"}
                </button>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
              >
                <FaArrowLeft size={12} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}