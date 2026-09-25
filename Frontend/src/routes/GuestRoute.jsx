import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (token) {
    if (!userString) {
      localStorage.removeItem("token");
      return <Outlet />;
    }
    try {
      const user = JSON.parse(userString);
      const destination =
        user?.role === "admin"
          ? "/admin/dashboard"
          : user?.role === "teacher"
            ? "/teacher/dashboard"
            : user?.role === "librarian"
              ? "/librarian/library/dashboard"
              : user?.role === "supervisor"
                ? "/supervisor/dashboard"
                : "/";
      return <Navigate to={destination} replace />;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
  return <Outlet />;
}
