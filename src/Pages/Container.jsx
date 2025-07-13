import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

function Container() {
  return (
    <React.Fragment>
      <Navbar />
      <section className="flex">
        <Sidebar />
        <section className="w-full min-h-screen bg-slate-50 p-5">
          <Outlet />
        </section>
      </section>
    </React.Fragment>
  );
}

export default Container;
