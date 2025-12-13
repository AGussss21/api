import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import AdminNavbar from "../components/Navbar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar}
      />

      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ml-0 
          ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
