import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (token && userString) {
    try {
      const user = JSON.parse(userString);
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return <Outlet />;
};

export default GuestRoute;
