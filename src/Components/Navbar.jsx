import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import accountImg from "../assets/user-min.png";

function Navbar({ onMenuClick }) {
  const Admin = {
    ProfileImage: accountImg,
    Name: "Admin",
    EmployeeType: "Committee",
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile hamburger button */}
        <button
          onClick={onMenuClick}
          className="mr-2 text-gray-800 md:hidden"
          title="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/admin/dashboard" className="text-xl font-semibold text-lavender--600">
          CSI CHURCH VYRAKUDI
        </Link>

        {/* Admin details */}
        <div className="flex items-center space-x-3">
          <img className="rounded-full w-9 h-9" src={Admin?.ProfileImage} alt="user" />
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900">{Admin?.Name}</div>
            <div className="text-xs text-gray-500">{Admin?.EmployeeType}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
