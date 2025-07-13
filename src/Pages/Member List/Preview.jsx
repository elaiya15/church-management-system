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

  const [Data, setData] = useState({
    family_head: "",
    family_head_name: "",
    relationship_with_family_head: "",
    primary_family_id: "",
    secondary_family_id: "",
    member_id: "",
    assigned_member_id: "",
    member_name: "",
    member_tamil_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
    occupation: "",
    community: "",
    nationality: "",
    member_photo: "",
    permanent_address: {
      address: "",
      city: "",
      district: "",
      state: "",
      zip_code: "",
    },
    present_address: {
      address: "",
      city: "",
      district: "",
      state: "",
      zip_code: "",
    },
    baptized_date: "",
    communion_date: "",
    marriage_date: "",
    joined_date: "",
    left_date: "",
    reason_for_inactive: "",
    description: "",
    rejoining_date: "",
    reason_for_rejoining: "",
    status: "",
  });
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${URL}/member/${params.id}`, {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        setResponse({
          status: "Failed",
          message: "Un Authorized! Please Login Again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 1000);
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
        }, 1000);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  return (
    <React.Fragment>
      {loading ? (
      <div className="flex justify-center items-center h-screen">
        <Spinners /> {/* Spinner component */}
      </div>
    ) : (
      <section className="w-full bg-slate-50 rounded-ss">
        <div className="w-full bg-white rounded-ss flex flex-col p-5 mb-20 space-y-10">
         
          <p className="">
            <i  onClick={() => navigate(-1) } className="hover:cursor-pointer fa-solid fa-arrow-left-long text-2xl"></i>
          </p>
          
          <div className="flex items-start justify-between">
            <div className="w-full flex flex-col">
              <div className="inline-flex justify-between items-center">
                <h1 className="text-xl text-lavender--600 font-semibold">
                  Member Details
                </h1>
                <div className="inline-flex space-x-10">
                  <h1
                    className={`${
                      Data && Data.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    } font-semibold px-5`}
                  >
                    {Data && Data.status}
                  </h1>
                  {Data && Data.reason_for_inactive !== "Death" ? (
                    <Link
                      to={`/admin/member/${Data && Data.member_id}/edit`}
                      className="text-lavender--700 hover:text-lavender--500 text-base font-semibold"
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="w-full flex justify-end mt-3">
                <img
                  src={`${URL}${Data.member_photo}`}
                  // src={`data:image/*;base64,${Data.member_photo}`}
                  alt="Profile Image"
                  className="w-28"
                />
              </div>
              <div className="flex flex-col pt-5 ps-5">
                <table className="w-full max-w-4xl text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Primary Family Id
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.primary_family_id}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Secondary Family Id
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.secondary_family_id !== null
                          ? Data.secondary_family_id
                          : "Nil"}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Member Id
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.member_id}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Assigned Member Id
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.assigned_member_id}
                      </td>
                    </tr>
                    {Data && Data.family_head !== undefined ? (
                      <>
                        <tr className=" dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                            Family Head Name
                          </td>
                          <td className="px-4 py-3 text-base">
                            {Data && Data.member_name}
                          </td>
                        </tr>
                        {Data.member_tamil_name !== undefined ? (
                          <tr className=" dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                              Family Head Tamil Name
                            </td>
                            <td className="px-4 py-3 text-base">
                              {Data && Data.member_tamil_name}
                            </td>
                          </tr>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <tr className=" dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                            Member Name
                          </td>
                          <td className="px-4 py-3 text-base">
                            {Data && Data.member_name}
                          </td>
                        </tr>
                        {Data.member_tamil_name !== undefined ? (
                          <tr className=" dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                              Member Tamil Name
                            </td>
                            <td className="px-4 py-3 text-base">
                              {Data && Data.member_tamil_name}
                            </td>
                          </tr>
                        ) : null}
                        <tr className=" dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                            Family Head Name
                          </td>
                          <td className="px-4 py-3 text-base">
                            {Data && Data.family_head_name}
                          </td>
                        </tr>
                        <tr className=" dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                            Relationship with Family Head
                          </td>
                          <td className="px-4 py-3 text-base">
                            {Data && Data.relationship_with_family_head}
                          </td>
                        </tr>
                      </>
                    )}

                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Gender
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.gender}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Mobile Number
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.mobile_number}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Email
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.email}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Date of Birth
                      </td>
                      <td className="px-4 py-3 text-base">
                        {moment(new Date(Data && Data.date_of_birth)).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Community
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.community}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Nationality
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.nationality}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Occupation
                      </td>
                      <td className="px-4 py-3 text-base">
                        {Data && Data.occupation}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700 align-top">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Present Address
                      </td>
                      <td className="px-4 py-3 text-base max-w-xs">
                        {Data &&
                          Data.present_address &&
                          Object.values(Data.present_address).join(", ")}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700 align-top">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Permanent Address
                      </td>
                      <td className="px-4 py-3 text-base max-w-xs">
                        {Data &&
                          Data.permanent_address &&
                          Object.values(Data.permanent_address).join(", ")}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Baptized Date
                      </td>
                      <td className="px-4 py-3 text-base">
                        {moment(new Date(Data && Data.baptized_date)).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Communion Date
                      </td>
                      <td className="px-4 py-3 text-base">
                        {moment(new Date(Data && Data.communion_date)).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                    {Data && Data.marriage_date !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Marriage Date
                        </td>
                        <td className="px-4 py-3 text-base">
                          {moment(new Date(Data && Data.marriage_date)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                      </tr>
                    ) : null}
                    <tr className=" dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                        Joining Date
                      </td>
                      <td className="px-4 py-3 text-base">
                        {moment(new Date(Data && Data.joined_date)).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                    {Data && Data.left_date !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Left Date
                        </td>
                        <td className="px-4 py-3 text-base">
                          {moment(new Date(Data && Data.left_date)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                      </tr>
                    ) : null}
                    {Data && Data.reason_for_inactive !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Reason for Inactive
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data && Data.reason_for_inactive}
                        </td>
                      </tr>
                    ) : null}
                    {Data && Data.description !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Description
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data && Data.description}
                        </td>
                      </tr>
                    ) : null}
                    {Data && Data.rejoining_date !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Rejoining Date
                        </td>
                        <td className="px-4 py-3 text-base">
                          {moment(new Date(Data && Data.rejoining_date)).format(
                            "YYYY-MM-DD"
                          )}
                        </td>
                      </tr>
                    ) : null}
                    {Data && Data.reason_for_rejoining !== null ? (
                      <tr className=" dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-3 text-lg font-semibold text-gray-700">
                          Reason for Rejoining
                        </td>
                        <td className="px-4 py-3 text-base">
                          {Data && Data.reason_for_rejoining}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {Response.status !== null ? (
          Response.status === "Success" ? (
            <SuccessMessage Message={Response.message} />
          ) : Response.status === "Failed" ? (
            <FailedMessage Message={Response.message} />
          ) : null
        ) : null}
      </section>    )}
      {Response.status !== null ? (
        Response.status === "Success" ? (
          <SuccessMessage Message={Response.message} />
        ) : Response.status === "Failed" ? (
          <FailedMessage Message={Response.message} />
        ) : null
      ) : null}
    </React.Fragment>
  );
}

export default Preview;
