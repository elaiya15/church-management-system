import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";

const FamilyTable = () => {
  const { familyId } = useParams(); // Get familyId from URL params
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tableHeading = [
    "Sl. no.",
    "Pastor Family ID",
    "Pastor ID",
    "Pastor Name",
    "Status",
    "Action",
  ];

  useEffect(() => {
    const fetchFamilyData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/pastor/family/${familyId}`);
        setMembers(response.data.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch family data");
        setMembers([]);
      }
      setLoading(false);
    };

    fetchFamilyData();
  }, [familyId]);

  return (
    <div className="max-w-5xl p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">
        Family Members (ID: {familyId})
      </h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-base text-gray-700 bg-white">
            <tr>
              {tableHeading.map((item, index) => (
                <th scope="col" className="px-4 py-3" key={index}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((item, index) => (
                <tr className="bg-white border-b" key={item.member_id}>
                  <th
                    scope="row"
                    className="px-4 py-4 text-sm font-medium text-gray-900"
                  >
                    {index + 1}
                  </th>
                  <td className="px-4 py-4 text-sm">{item.familyId}</td>
                  <td className="px-4 py-4 text-sm">{item.member_id}</td>
                  <td className="px-4 py-4 text-sm">{item.member_name}</td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`${
                        item.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      } px-4 py-4 text-sm font-semibold`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="flex gap-5 px-4 py-4 text-sm">
                    <Link
                      to={`/admin/pastor/${item.member_id}/preview`}
                      className="px-1.5 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FamilyTable;
