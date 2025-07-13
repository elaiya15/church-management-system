import React from "react";
import Spinners from "../Spinners";

function StatsCard({ title, value, icon, loading }) {
  return (
    <div className="bg-white p-4  rounded-lg shadow-md flex items-center justify-between border-2 border-lavender--600">
      <div className="ml-4">
        {loading ? (
          <Spinners />
        ) : (
          <div className="text-5xl font-bold text-lavender--600 *:">
            {value}
          </div>
        )}
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      <div className="flex-shrink-0">
        <img
          src={icon}
          alt={`${title} icon`}
          className="w-8 sm:w-10 md:w-12 lg:w-16 h-auto pt-14"
        />
      </div>
    </div>
  );
}

export default StatsCard;
