import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/admin/dashboard"} replace />;
  }
  return <Outlet />;
};
export default GuestRoute;
