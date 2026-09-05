import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./NavBar";
function DashboardLayout() {
  return (
    <div className="md:flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 bg-white overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;