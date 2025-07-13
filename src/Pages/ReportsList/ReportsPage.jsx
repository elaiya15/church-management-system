import React from "react";
import ReportsList from "./ReportsList";
import Birthday from "/src/Components/Reports/BirthdayReports";
import Marriage from "/src/Components/Reports/Marriage";
import Baptism from "/src/Components/Reports/Baptism";
import Communion from "/src/Components/Reports/Communion";
import Inactive from "/src/Components/Reports/Inactive";
import Rejoining from "/src/Components/Reports/Rejoining";
import Reminders from "/src/Components/Reports/Reminders";

import { useState } from "react";

const ReportsPage = () => {
  const [active, setActive] = useState(0);

  console.log(active);
  return (
    <div className="relative flex h-full bg-gray-20">
      <ReportsList active={active} setActive={setActive} />

      {active === 0 ? (
        <Birthday />
      ) : active === 1 ? (
        <Marriage />
      ) : active === 2 ? (
        <Baptism />
      ) : active === 3 ? (
        <Communion />
      ) : active === 4 ? (
        <Inactive />
      ) : active === 5 ? (
        <Rejoining />
      ) :  active === 6 ? (
        <Reminders />  
        )  :(
        <></>
      )}
    </div>
  );
};
export default ReportsPage;
