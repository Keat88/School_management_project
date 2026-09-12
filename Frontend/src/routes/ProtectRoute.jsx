import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!userString) {
    return <Navigate to="/" replace />;
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectRoute;