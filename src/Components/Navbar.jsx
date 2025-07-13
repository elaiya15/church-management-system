import React from "react";
// import Logo from "../assets/DGF-Logo-Name-min.png";
import { Link, useLocation } from "react-router-dom";
import accountImg from "../assets/user-min.png";
function Navbar() {
  const Admin = {
    ProfileImage: accountImg,
    Name: "Admin",
    EmployeeType: "Committee",
  };
  const location = useLocation();
  return (
    <React.Fragment>
      <nav className="w-full bg-white border ">
        <div className="inline-flex items-center justify-between w-screen p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7">
          <Link
            title="dashboard"
            to="/admin/dashboard"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <h1 className="text-2xl font-semibold text-lavender--600">
              CSI CHURCH VYRAKUDI
            </h1>
          </Link>
          <div className="inline-flex items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-7">
            <div className="h-6 border border-gray-400 sm:h-7 md:h-8"></div>
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5">
              <button
                type="button"
                className="rounded-full p-0.5 focus:ring-2 focus:ring-lavender--600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <img
                  className="w-8 rounded-full sm:w-9 md:w-10"
                  src={Admin && Admin.ProfileImage}
                  alt="user photo"
                />
              </button>
              <div className="">
                <span className="block text-xs font-medium text-gray-900 sm:text-sm md:text-base dark:text-white">
                  {Admin && Admin.Name}
                </span>
                <span className="block text-[10px] sm:text-xs md:text-sm text-gray-500 truncate dark:text-gray-400">
                  {Admin && Admin.EmployeeType}
                </span>
              </div>
              <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse ">
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3 md:hidden">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {Admin && Admin.Name}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {Admin && Admin.EmployeeType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

export default Navbar;
