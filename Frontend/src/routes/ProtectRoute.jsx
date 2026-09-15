import { Navigate, Outlet } from "react-router-dom";

export default function ProtectRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (!token || !userString) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    if (allowedRoles) {
      const hasAccess = Array.isArray(allowedRoles)
        ? allowedRoles.includes(user?.role)
        : user?.role === allowedRoles;

      if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  } catch (error) {
    console.error("Failed to parse user data:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
