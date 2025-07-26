import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

function Container() {
  return (
    <React.Fragment>
      <Navbar />
      <section className="md:flex">
        <div className="">
        <Sidebar />
        </div>
        <section className="w-full min-h-screen md:p5 bg-slate-50">
          <Outlet />
        </section>
      </section>
    </React.Fragment>
  );
}

export default Container;
