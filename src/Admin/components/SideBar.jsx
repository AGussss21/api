import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, MessageSquare, Store, LogOut, X, ChevronLeft, Menu } from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar, closeSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/product", name: "Produk", icon: <ShoppingBag size={20} /> },
    { path: "/admin/testimonials", name: "Testimoni", icon: <MessageSquare size={20} /> },
    { path: "/admin/businessinfo", name: "Info Usaha", icon: <Store size={20} /> },
    { path: "/admin/ordermanagement", name: "Kelola Pesanan", icon: <ShoppingBag size={20} /> },
  ];

  return (
    <>
      <div 
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* SIDEBAR */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 
          ${isOpen ? "lg:w-64" : "lg:w-20"} 
        `}
      >
        <div className={`flex items-center h-16 border-b border-gray-100 transition-all relative ${isOpen ? "px-6" : "justify-center px-0"}`}>
          <h1 className={`font-bold text-[#F2994A] whitespace-nowrap overflow-hidden transition-all duration-300 ${
            isOpen ? "text-2xl opacity-100" : "w-0 opacity-0 lg:hidden"
          }`}>
            Lola Cake
          </h1>
          
          <button 
            onClick={toggleSidebar}
            className={`hidden lg:flex absolute items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 ${
               isOpen ? "right-4" : "static bg-transparent hover:bg-transparent"
            }`}
          >
             
             {isOpen ? <ChevronLeft size={18} /> : null } 
          </button>
          
          {!isOpen && (
             <button onClick={toggleSidebar} className="hidden lg:flex absolute inset-0 items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-all">
                <Menu size={20} className="text-gray-600"/>
             </button>
          )}

          <button onClick={closeSidebar} className="lg:hidden absolute right-4 text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="p-2 space-y-2 mt-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) closeSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium whitespace-nowrap overflow-hidden ${
                  isActive
                    ? "bg-[#FFF8C9] text-[#F2994A]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${!isOpen ? "justify-center" : ""}`
              }
            >
              <div className="min-w-[20px]">{item.icon}</div>
              <span className={`transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 w-0 hidden lg:hidden"}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-2 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium whitespace-nowrap overflow-hidden ${!isOpen ? "justify-center" : ""}`}
          >
            <div className="min-w-[20px]"><LogOut size={20} /></div>
            <span className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden lg:hidden"}`}>
              Keluar
            </span>
          </button>
        </div>
      </div>
    </>
  );
}