import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthApi } from "../../data/AuthApi";
import { FaArrowLeft, FaGithub, FaGoogle } from "react-icons/fa6";
import LoadingModal from "../../hooks/LoadingModal";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await AuthApi.Login(formData);
      // If AuthApi returns the raw axios response, use res.data.token
      // If AuthApi already returns response.data, use res.token
      const responseData = res?.data || res;
      const token = responseData.token || responseData.access_token;
      const user = responseData.user;
      if (token) {
        login(user, token);
        setFeedback({ type: "success", text: "Login successful!" });
        setTimeout(() => {
          if (user?.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (user?.role === "teacher") {
            window.location.href = "/teacher/dashboard";
          } else {
            window.location.href = "/";
          }
        }, 500);
      } else {
        window.location.href = "/";
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

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Completing login..."
        subtitle="Finalizing your request"
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
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
                >
                  <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
                  Back to home
                </Link>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-4 font-bold text-2xl">
                  SM
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in to your School Management Portal account
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/api/auth/google/redirect")
                }
                className="flex justify-center items-center gap-x-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <FaGoogle size={18} className="text-slate-600" />
                Google
              </button>
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8000/api/auth/github/redirect")
                }
                className="flex justify-center items-center gap-x-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <FaGithub size={18} className="text-slate-900" />
                Github
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or continue with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@school.edu"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
