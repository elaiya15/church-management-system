/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Expense from "./Pages/Expense/Expense";
import ContainerMain from "./Pages/Container";

import FamilyContainer from "./Pages/Family List/Container";
import FamilyList from "./Pages/Family List/List";
import FamilyAddNew from "./Pages/Family List/AddNew";
import AddFamilyPreview from "./Pages/Family List/AddFamilyPreview";

import MemberContainer from "./Pages/Member List/Container";
import MemberList from "./Pages/Member List/List";
import MemberAddNew from "./Pages/Member List/AddNew";
import MemberPreview from "./Pages/Member List/Preview";
import MemberEdit from "./Pages/Member List/Edit";

import OfferingList from "./Pages/Offerings/OfferingList";
import MarriageOfferings from "./Pages/Offerings/MarriageOfferings";
import BagOfferType from "./Pages/Offerings/bagOfferType";
import BagOfferList from "./Pages/Offerings/bagOfferingList";

import PasterContainer from "./Pages/Paster/Container";
import PasterNavList from "./Pages/Paster/List";
import PasterPreview from "./Pages/Paster/Preview";
import PasterEdit from "./Pages/Paster/Edit";
import PasterNewFamily from "./Pages/Paster/NewFamily";
import FamilyTable from "./Pages/Paster/familyId list";

import OfferType from "./Pages/Offerings/OfferType";
import Dashboard from "./Pages/Dashboard/Dashboard";
import TreeContainer from "./Pages/Tree/TreeContainer";
import TreePreview from "./Pages/Tree/Preview";
import BirthdayReports from "./Components/Reports/BirthdayReports";
import MarriageReports from "./Components/Reports/Marriage";
import BaptismReports from "./Components/Reports/Baptism";
import CommunionReports from "./Components/Reports/Communion";
import InActiveReports from "./Components/Reports/Inactive";
import RejoiningReports from "./Components/Reports/Rejoining";
import RemindersReports from "./Components/Reports/Reminders";
import ReportsList from "./Pages/ReportsList/ReportsList";
import ReportsPage from "./Pages/ReportsList/ReportsPage";

export const URL = import.meta.env.VITE_BACKEND_API_URL;

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to={`/admin/dashboard`} />} />
          <Route path="/" element={<Login />} />
          <Route path="admin" element={<ContainerMain />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reminders" element={<RemindersReports />} />

            <Route path="family" element={<FamilyContainer />}>
              <Route path=":id/preview" element={<AddFamilyPreview />} />
              <Route path="list" element={<FamilyList />} />
              <Route path="add/new" element={<FamilyAddNew />} />
              <Route path=":family_id" element={<TreeContainer />}>
                <Route path="tree/preview" element={<TreePreview />} />
                <Route path="member/add/new" element={<MemberAddNew />} />
              </Route>
            </Route>

            <Route path="member" element={<MemberContainer />}>
              <Route path="list?" element={<MemberList />} />
              <Route path=":id/edit" element={<MemberEdit />} />
              <Route path=":id/preview" element={<MemberPreview />} />
            </Route>
            <Route path="pastor" element={<PasterContainer />}>
              <Route path="add/new" element={<PasterNewFamily />} />
              <Route path="list?" element={<PasterNavList />} />
              <Route path="family/:familyId" element={<FamilyTable />} />

              <Route path=":id/edit" element={<PasterEdit />} />
              <Route path=":id/preview" element={<PasterPreview />} />
            </Route>

            <Route path="expense/list" element={<Expense />} />

            <Route path="offerings" element={<FamilyContainer />}>
              <Route path="type" element={<OfferType />} />
              <Route path="Common/list/:category" element={<OfferingList />} />
              <Route
                path="list/MarriageOfferings"
                element={<MarriageOfferings />}
              />
              <Route path="bagtype" element={<BagOfferType />} />
              <Route
                path="BagOffer/list/:category"
                element={<BagOfferList />}
              />
            </Route>

            <Route path="Reports" element={<ReportsPage />} />
            <Route path="birthday" element={<BirthdayReports />} />
            <Route path="marriage" element={<MarriageReports />} />
            <Route path="baptism" element={<BaptismReports />} />
            <Route path="communion" element={<CommunionReports />} />
            <Route path="inactive" element={<InActiveReports />} />
            <Route path="rejoining" element={<RejoiningReports />} />
            <Route path="reminders" element={<RemindersReports />} />
            {/* <Route path="ReportsList" element={<ReportsList />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
