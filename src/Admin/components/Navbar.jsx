import React from "react";
import { Menu, User } from "lucide-react";

export default function AdminNavbar({ toggleSidebar }) {
  return (
    <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <button 
        onClick={toggleSidebar} 
        className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none lg:hidden"
      >
        <Menu size={24} />
      </button>
      
      <div className="flex-1"></div> 
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-800">Admin Lola</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
           <User size={20} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}