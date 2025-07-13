import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import { URL } from "../../App";
import { initFlowbite } from "flowbite";
import axios from "axios";
import moment from "moment";
import Spinners from "../../Components/Spinners";

function Preview() {
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    initFlowbite();
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [Data, setData] = useState({});

  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/pastor/${params.id}`, {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setResponse({
          status: "Failed",
          message: "Unauthorized! Please log in again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 1000);
      } else if (error.response?.status === 500) {
        setResponse({
          status: "Failed",
          message: "Server Unavailable!",
        });
        setTimeout(() => {
          setResponse({ status: null, message: "" });
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinners />
        </div>
      ) : (
        <section className="w-full bg-slate-50 rounded-ss">
          <div className="flex flex-col w-full p-5 mb-20 space-y-10 bg-white rounded-ss">
            <p>
              <i
                onClick={() => navigate(-1)}
                className="text-2xl hover:cursor-pointer fa-solid fa-arrow-left-long"
              ></i>
            </p>

            <div className="flex items-start justify-between">
              <div className="flex flex-col w-full">
                <div className="inline-flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-lavender--600">
                    Member Details
                  </h1>
                  <div className="inline-flex space-x-10">
                    <h1
                      className={`${
                        Data.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold px-5`}
                    >
                      {Data.status}
                    </h1>
                    <Link
                      to={`/admin/pastor/${Data.member_id}/edit`}
                      className="text-base font-semibold text-lavender--700 hover:text-lavender--500"
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </Link>
                  </div>
                </div>
                <div className="flex justify-end w-full mt-3 ">
                  <img
                    src={Data.member_photo ? `${URL}${Data.member_photo}` : ""}
                    alt="Profile"
                    className="w-28"
                  />
                </div>
                <div className="flex flex-col pt-5 ps-5 ">
                  <table className="w-full max-w-4xl text-xs text-left text-gray-500 dark:text-gray-400">
                    <tbody>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Family ID
                        </td>
                        <td className="px-4 py-3 text-base">{Data.familyId}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Member ID
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.member_id}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Mobile Number
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.mobile_number}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Member Name
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.member_name}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Member Tamil Name
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.member_tamil_name}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Gender
                        </td>
                        <td className="px-4 py-3 text-base">{Data.gender}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Date of Birth
                        </td>
                        <td className="px-4 py-3 text-base">
                          {moment(Data.date_of_birth).format("YYYY-MM-DD")}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Email
                        </td>
                        <td className="px-4 py-3 text-base">{Data.email}</td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Occupation
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.occupation}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Community
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.community}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Nationality
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data.nationality}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Permanent Address
                        </td>
                        <td className="px-4 py-3 text-base">
                          {/* {Data.permanent_address} */}
                          {Data &&
                            Data.permanent_address &&
                            Object.values(Data.permanent_address).join(", ")}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Present Address
                        </td>
                        <td className="px-4 py-3 text-base">
                          {/* {Data.present_address} */}
                          {Data &&
                            Data.present_address &&
                            Object.values(Data.present_address).join(", ")}
                        </td>
                      </tr>
                      <tr className="dark:bg-gray-800">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Joined Date
                        </td>
                        <td className="px-4 py-3 text-base">
                          {moment(Data.joined_date).format("YYYY-MM-DD")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
}

export default Preview;
