import { Navigate, Outlet } from "react-router-dom";

const UserRoute = ({ allowRole }) => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString) {
      return <Navigate to="/" replace />;
    }
    const user = JSON.parse(userString);
    if (user?.role === allowRole) {
      return <Outlet />;
      }
    return <Navigate to="/" replace />;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};
export default UserRoute;
