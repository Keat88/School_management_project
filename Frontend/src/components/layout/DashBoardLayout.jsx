import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust import paths as needed
import Navbar from "./Navbar";

function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
