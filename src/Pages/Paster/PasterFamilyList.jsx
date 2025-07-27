import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { URL } from "../../App";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Spinners from "../../Components/Spinners";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import down from "../../assets/downloade.svg";
import jsPDF from "jspdf";
import moment from "moment";
import Dropdown from "../../Components/Helpers/DropDown";

function List() {
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [Data, setData] = useState([]);
  const [categories, setCategories] = useState(["All", "Active", "Inactive"]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [Search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Response, setResponse] = useState({ status: null, message: "" });

  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const pageParam = parseInt(params.get("page")) || 1;

    setSearch(searchParam);
    setCurrentPage(pageParam);

    fetchData(pageParam, searchParam);
  }, [location.search]); // ✅ This will now trigger correctly

  const fetchData = async (page, search) => {
    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;

    setLoading(true);

    try {
      const statusQuery = selectedCategory === "All" ? "" : selectedCategory;
      const response = await axios.get(
        `${URL}/pastor/familymembers?search=${search}&page=${page}&limit=15&status=${statusQuery}`,
        {
          headers: { Authorization: token },
          signal, // Pass signal for aborting
        }
      );
      setData(response.data.members);
      setTotalPages(response.data.TotalPages);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      params.set("search", newSearch);
      params.set("page", "1");

      // Preserve tab selection
      const currentTab = params.get("tab") || "paster-family-list";
      params.set("tab", currentTab);

      navigate(`?${params.toString()}`);
    }, 300);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > TotalPages) return; // Prevent invalid pages

    const params = new URLSearchParams(location.search);
    params.set("page", newPage);
    params.set("tab", "paster-family-list"); // ✅ Preserve tab selection

    navigate(`?${params.toString()}`);
  };

  const tableHeading = [
    "Sl. no.",
    "Pastor Family ID",
    "Pastor Id",
    "Family Head Name",
    "Action",
  ];

  const handleSelect = (item) => {
    setSelectedCategory(item);
    setCurrentPage(1);

    const params = new URLSearchParams(location.search);
    params.set("search", Search);
    params.set("page", "1");
    params.set("tab", "paster-family-list"); // ✅ Preserve tab selection

    navigate(`?${params.toString()}`);
  };
  return (
  <React.Fragment>
  <div className="w-full p-4 mt-5 space-y-6 bg-white rounded-t-lg">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-lg font-semibold text-lavender--600">Pastor Family List</h1>

      {/* Search & Add New */}
      <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:space-x-4 sm:w-auto">
        <input
          type="search"
          id="default-search"
          className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded sm:w-auto bg-gray-50 focus:ring-lavender--600 focus:border-lavender--600"
          placeholder="Search Members..."
          value={Search}
          onChange={handleSearchChange}
        />

        <Link
          to={`/admin/pastor/add/new`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm text-white rounded bg-lavender--600 hover:bg-lavender--700"
        >
          <i className="mr-1 fa-solid fa-plus"></i> New Family
        </Link>
      </div>
    </div>

    {/* Table */}
    {loading ? (
      <Spinners />
    ) : Data && Data.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-base text-gray-700 bg-white">
            <tr>
              {tableHeading.map((item, index) => (
                <th scope="col" className="px-4 py-3 whitespace-nowrap" key={index}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Data.map((item, index) => (
              <tr className="bg-white border-b" key={item.head}>
                <th
                  scope="row"
                  className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  {(CurrentPage - 1) * 15 + (index + 1)}
                </th>
                <td className="px-4 py-4 text-sm whitespace-nowrap">{item.familyId}</td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">{item.member_id}</td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">{item.member_name}</td>
                <td className="px-4 py-4 text-sm">
                  <Link
                    to={`/admin/pastor/family/${item.familyId}`}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-sm text-center text-gray-600">No data found</div>
    )}

    {/* Pagination */}
    <div className="relative flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handlePageChange(CurrentPage - 1)}
          disabled={CurrentPage === 1}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          className={`px-4 py-2 rounded ${
            CurrentPage ? "bg-lavender--600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {CurrentPage}
        </button>

        <button
          onClick={() => handlePageChange(CurrentPage + 1)}
          disabled={CurrentPage === TotalPages || TotalPages === 0}
          className="px-4 py-2 w-[100px] text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <span className="px-4 py-2 text-center text-gray-700 bg-gray-100 rounded">
          Total Page: <span>{TotalPages}</span>
        </span>
        <span
          onClick={() => handlePageChange(TotalPages)}
          className={`${
            TotalPages === CurrentPage
              ? "opacity-50 cursor-not-allowed bg-gray-100 px-4 py-2 rounded"
              : "px-4 py-2 text-blue-400 bg-gray-100 rounded hover:text-blue-800 cursor-pointer"
          }`}
        >
          Last Page
        </span>
      </div>
    </div>
  </div>
</React.Fragment>

  );
}

export default List;
