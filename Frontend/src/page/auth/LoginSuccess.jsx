import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingModal from "../../hooks/LoadingModal";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const token = searchParams.get("token");
    const avatar = searchParams.get("avatar");
    if (token) {
      localStorage.setItem("token", token);
      if (avatar) {
        localStorage.setItem("userAvatar", decodeURIComponent(avatar));
      }
      fetch("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          if (userData) {
            login(userData, token);
          }
          navigate("/admin/dashboard", { replace: true });
        })
        .catch((error) => {
          console.error("Auth fetch error:", error);
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 w-full min-h-screen
         flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs text-center border border-slate-100 transform transition-all">
          {/* Animated Icon / Spinner Container */}
          <div className="relative inline-flex items-center justify-center mb-4">
            {/* Rotating Ring Outer Border */}
            <div className="w-16 h-16 rounded-2xl border-4 border-blue-100 border-t-blue-600 animate-spin" />

            {/* Logo / Badge in Center */}
            <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-blue-600">
              SM
            </div>
          </div>

          {/* Dynamic Titles */}
          <h3 className="text-base font-semibold text-slate-800 tracking-tight">
            Wait to complete Login...
          </h3>
        </div>
      </div>
    </>
  );
}
