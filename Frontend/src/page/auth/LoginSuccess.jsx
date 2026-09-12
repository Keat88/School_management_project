import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const avatar = searchParams.get("avatar");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((userData) => {
        login(userData, token);

        // Dynamically route based on role if applicable
        if (userData?.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Auth fetch error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userAvatar");
        navigate("/login", { replace: true });
      });
  }, [searchParams, navigate, login]);

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs text-center border border-slate-100 transform transition-all">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-blue-600">
            SM
          </div>
        </div>
        <h3 className="text-base font-semibold text-slate-800 tracking-tight">
          Completing your login...
        </h3>
      </div>
    </div>
  );
}