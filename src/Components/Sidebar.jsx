// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "../assets/Group 24-min.png";
import FamilyListIcon from "../assets/Group 1000001882-min.png";
import MemberListIcon from "../assets/Group 1000002033-min.png";
import OfferingsIcon from "../assets/Group 1000002035-min.png";
import ExpenseIcon from "../assets/Vector-min.png";
import LogoutIcon from "../assets/Group 56-min.png";
import ReportsIcon from "../assets/ReportsIcon.png";
import { initFlowbite } from "flowbite";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  // console.log(showDropdown);
  useEffect(() => {
  if (location.pathname.includes("/offerings")) {
    setShowDropdown(true);
  }
}, [location.pathname]);


  useEffect(() => {
    initFlowbite();
  }, []);

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: DashboardIcon,
      label: "Dashboard",
      match: "/dashboard",
    },
    {
      to: "/admin/family/list",
      icon: FamilyListIcon,
      label: "Family List",
      match: "/family",
    },
    {
      to: "/admin/member/list",
      icon: MemberListIcon,
      label: "Member List",
      match: "/member",
    },
    {
      to: "/admin/pastor/list",
      icon: MemberListIcon,
      label: "Pastor",
      match: "/pastor",
    },
    {
      to: "/admin/expense/list",
      icon: ExpenseIcon,
      label: "Expense",
      match: "/expense",
    },
    {
      to: "/admin/reports",
      icon: ReportsIcon,
      label: "Reports",
      match: "/reports",
    },
  ];

  const offeringLinks = [
    {
      to: "/admin/offerings/type",
      label: "Common Offerings",
      match: "Common",
    },
    {
      to: "/admin/offerings/list/MarriageOfferings",
      label: "Marriage Offerings",
      match: "/MarriageOfferings",
    },
    {
      to: "/admin/offerings/bagtype",
      label: "Bag Offerings",
      match: "/bagtype",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0  bg-black bg-opacity-40 z-40 md:hidden transition-opacity ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 w-[15rem] lg:w-[20rem] h-full bg-white transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:block`}
      >
        <div className="flex flex-col justify-between h-full overflow-y-auto">
          <ul className="space-y-5 font-medium">
            {navItems.map(({ to, icon, label, match }, idx) => (
              <li key={idx}>
                <Link
                  to={to}
                  onClick={() => {
  setShowDropdown(false);
  onClose();
}}

                  className={`${
                    location.pathname.includes(match)
                      ? "bg-lavender--600 text-white hover:text-lavender--600 hover:bg-slate-100"
                      : "text-gray-800 hover:bg-slate-100 hover:text-lavender--600"
                  } flex items-center px-10 py-3 rounded-e-lg group`}
                >
                  <img src={icon} className="w-5 h-5" alt="icon" />
                  <span className="text-lg ms-5">{label}</span>
                </Link>
              </li>
            ))}

            {/* Offerings dropdown */}
            <li>
              <div
                className="flex items-center px-10 py-3 cursor-pointer rounded-e-lg group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={OfferingsIcon} className="w-5 h-5" alt="offerings" />
                <span className="text-lg ms-5">Offerings</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {showDropdown && (
                <div className="mt-2 space-y-2 ml-14">
                {offeringLinks.map(({ to, label }, idx) => (
  <Link
    key={idx}
    to={to}
    onClick={() => {
      setShowDropdown(false);
      onClose();
    }}
    className={`${
      location.pathname.startsWith(to)
        ? "bg-lavender--600 text-white hover:text-lavender--600 hover:bg-slate-100"
        : "text-gray-800 hover:bg-slate-100 hover:text-lavender--600"
    } block px-6 py-2 rounded-lg`}
  >
    <span className="text-md">{label}</span>
  </Link>
))}

                </div>
              )}
            </li>
          </ul>

          {/* Logout */}
          <div className="px-10 py-3">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="flex items-center text-gray-800 rounded-e-lg hover:bg-slate-100 hover:text-lavender--600"
            >
              <img src={LogoutIcon} className="w-5 h-5" alt="logout" />
              <span className="text-lg ms-5">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
