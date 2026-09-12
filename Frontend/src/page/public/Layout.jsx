import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
// Import your Footer here if you have one

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is safely inside the Layout component, NOT inside <Routes> */}
      <Navbar />

      {/* Outlet renders whichever page route matches current URL */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
