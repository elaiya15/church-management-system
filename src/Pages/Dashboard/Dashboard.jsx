import React, { useEffect, useState } from "react";
import Chart from "../../Components/DashBoard/Chart";
import StatsCard from "../../Components/DashBoard/StatusCard";
import FamilyList from "../../Components/DashBoard/FamilyList";
import ExpenseList from "../../Components/DashBoard/ExpenseList";
import Status1 from "../../assets/Status 1-min.png";
import Status2 from "../../assets/Status 2-min.png";
import axios from "axios";
import { URL } from "../../App";
import { useNavigate } from "react-router-dom";
import Preview from "../Tree/Preview";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

function Dashboard() {
  const [families, setFamilies] = useState([]);
  const [member, setMember] = useState([]);
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const familyData = await fetchFamily();
        const memberData = await fetchMember();
        setFamilies(familyData);
        setMember(memberData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const fetchFamily = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/family/list`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.totalItems;
    } catch (error) {
      // if (error.response && error.response.status === 401) {
      //   setResponse({
      //     status: "Failed",
      //     message: "Unauthorized! Please Login Again.",
      //   });
      //   setTimeout(() => {
      //     window.localStorage.clear();
      //     navigate("/");
      //   }, 5000);
      // }
      // console.error("Error fetching family:", error);
      // return [];
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: "Un Authorized! Please Login Again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
      if (error.response.status === 500) {
        setResponse({
          status: "Failed",
          message: "Server Unavailable!",
        });
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMember = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${URL}/member/list`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data.totalItems;
    } catch (error) {
      // if (error.response && error.response.status === 401) {
      //   setResponse({
      //     status: "Failed",
      //     message: "Unauthorized! Please Login Again.",
      //   });
      //   setTimeout(() => {
      //     window.localStorage.clear();
      //     navigate("/");
      //   }, 5000);
      // }
      // return [];
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: "Un Authorized! Please Login Again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
      if (error.response.status === 500) {
        setResponse({
          status: "Failed",
          message: "Server Unavailable!",
        });
        setTimeout(() => {
          setResponse({
            status: null,
            message: "",
          });
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full  h-full md:w-1/3 space-y-4">
          <StatsCard
            title="Total Families"
            value={families}
            icon={Status2}
            loading={isLoading}
          />
          <StatsCard
            title="Total Members"
            value={member}
            icon={Status1}
            loading={isLoading}
          />
        </div>
        <div className="w-full md:w-2/3">
          <Chart />
        </div>
      </div>
      <div className="mt-4">
        <FamilyList />
      </div>
      <div className="mt-4">
        <ExpenseList />
      </div>
      {Response.status !== null ? (
        Response.status === "Success" ? (
          <SuccessMessage Message={Response.message} />
        ) : Response.status === "Failed" ? (
          <FailedMessage Message={Response.message} />
        ) : null
      ) : null}
    </div>
  );
}

export default Dashboard;
