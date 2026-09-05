import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const avatar = searchParams.get("avatar");

    if (token) {
      localStorage.setItem("token", token);
      if (avatar) {
        localStorage.setItem("userAvatar", decodeURIComponent(avatar));
      }
      // Fetch user profile from Laravel API to populate localStorage("user")
      fetch("http://localhost:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
          navigate("/admin/dashboard", { replace: true });
        })
        .catch(() => {
          navigate("/admin/dashboard", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-3 font-bold text-xl animate-pulse">
          SM
        </div>
        <p className="text-sm font-medium text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
}