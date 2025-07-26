import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FamilyList from "./PasterFamilyList.jsx";
import PasterList from "./PasterList.jsx";

function List() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "paster-list";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab") || "paster-list";
    setActiveTab(tabParam);
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="flex justify-center p-2 space-x-5 text-xl font-semibold">
        <button
          className={`px-4 py-2 ${
            activeTab === "paster-list"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("paster-list")}
        >
          Pastor List
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "paster-family-list"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("paster-family-list")}
        >
          Pastor Family List
        </button>
      </nav>

      {/* Conditional Rendering */}
      <div className="">
        {activeTab === "paster-family-list" ? <FamilyList /> : <PasterList />}
      </div>
    </div>
  );
}

export default List;
