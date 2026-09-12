import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  // Expanded array to hide Navbar and Footer on auth, password reset, and OTP pages
  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/resetpassword",
    "/otp",
  ];
  const isHiddenPage = hiddenRoutes.includes(location.pathname.toLowerCase());
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isHiddenPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isHiddenPage && <Footer />}
    </div>
  );
}
