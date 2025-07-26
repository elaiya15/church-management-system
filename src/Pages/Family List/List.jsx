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
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });

  const [isFirstRender, setIsFirstRender] = useState(true);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    // Get search parameters from URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const pageParam = parseInt(params.get("page")) || 1;

    setSearch(searchParam);
    setCurrentPage(pageParam);

    fetchData(pageParam, searchParam);
  }, [location.search, isFirstRender]);

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
        `${URL}/family/list?search=${search}&page=${page}&limit=15&status=${statusQuery}`,
        {
          headers: { Authorization: token },
          signal, // Pass signal for aborting
        }
      );
      setData(response.data.RegisteredData);
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
      setCurrentPage(1);
      navigate(`?search=${newSearch}&page=1`);
    }, 300); // Wait 300ms after the user stops typing
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`?search=${Search}&page=${newPage}`);
  };

  const tableHeading = [
    "Sl. no.",
    "Family ID",
    "Member Id",
    "Family Head Name",
    // "Status",
    "Action",
  ];

  const handleSelect = (item) => {
    setSelectedCategory(item);
    setCurrentPage(1);
    navigate(`?search=${Search}&page=1`);
  };
  const [isDownloading, setIsDownloading] = useState(false);

  // const handleDownloadPDF = async () => {
  //   try {
  //     const statusQuery = selectedCategory === "All" ? "" : selectedCategory;
  //     const res = await axios.get(
  //       `${URL}/family/download-list?status=${statusQuery}`,
  //       { headers: { Authorization: token } }
  //     );

  //     const Data = res.data.RegisteredData;
  //     const doc = new jsPDF();
  //     const headers = [["Sl. No.", "Family ID", "Member ID", "Family Head Name"]];

  //     const rows = Data.map((item, index) => [
  //       index + 1,
  //       item.family_id,
  //       item.member_id,
  //       item.family_head_name,
  //     ]);

  //     doc.autoTable({
  //       head: headers,
  //       body: rows,
  //     });

  //     doc.save("Family Reports.pdf");
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };
  const handleDownloadPDF = async () => {
    try {
      const statusQuery = selectedCategory === "All" ? "" : selectedCategory;
      const res = await axios.get(
        `${URL}/family/download-list?status=${statusQuery}`,
        { headers: { Authorization: token } }
      );
  
      const Data = res.data.RegisteredData;
      const doc = new jsPDF();
  
      const title = "Family List"; // Title to appear on each page
  
      // Function to add title before the table
      const addTitle = (doc, title) => {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(title, doc.internal.pageSize.width / 2, 20, { align: "center" });
      };
  
      const headers = [["Sl. No.", "Family ID", "Member ID", "Family Head Name"]];
  
      const rows = Data.map((item, index) => [
        index + 1,
        item.family_id,
        item.member_id,
        item.family_head_name,
      ]);
  
      doc.autoTable({
        head: headers,
        body: rows,
        margin: { top: 35 }, // Push table down to avoid overlap
        didDrawPage: function (data) {
          addTitle(doc, title); // Add title on every page
        },
      });
  
      doc.save("Family Reports.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
  return (
  <React.Fragment>
  {isDownloading && (
    <div className="p-4 text-sm font-semibold text-center text-blue-500 bg-blue-100 rounded-md">
      Your download is in progress, please wait...
    </div>
  )}

  <div className="flex flex-col w-full p-3 mt-5 space-y-6 bg-white rounded-t-lg">
    {/* Top Bar */}
    <div className="flex flex-col items-start justify-between space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="inline-flex space-x-2">
        <h1 className="text-base font-semibold text-lavender--600 sm:text-lg">
          Family List
        </h1>
      </div>

      {/* Right section */}
      <div className="flex flex-wrap items-center justify-start gap-4 space-x-2 sm:justify-end">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <input
            type="search"
            id="default-search"
            className="block w-full py-1 pl-8 pr-2 text-sm text-gray-900 border rounded bg-gray-50 sm:w-52 focus:ring-lavender--600 focus:border-lavender--600"
            placeholder="Search Members..."
            value={Search}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>

        {/* Add Button */}
        <Link
          to={`/admin/family/add/new`}
          className="px-3 py-1 text-sm text-white rounded bg-lavender--600 hover:bg-lavender--700"
        >
          <i className="fa-solid fa-plus"></i> New Family
        </Link>

        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          className="text-blue-600 hover:text-blue-800"
        >
          <img src={down} className="w-15 h-15" alt="Download" />
        </button>
      </div>
    </div>

    {/* Table Section */}
    {loading ? (
      <Spinners />
    ) : Data && Data.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
          <thead className="text-base text-gray-700 bg-white">
            <tr>
              {tableHeading.map((item, index) => (
                <th key={index} className="px-4 py-3">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Data.map((item, index) => (
              <tr
                key={item.head}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-4 py-4">
                  {((CurrentPage - 1) * 15) + (index + 1)}
                </td>
                <td className="px-4 py-4">{item.family_id}</td>
                <td className="px-4 py-4">{item.head}</td>
                <td className="px-4 py-4">{item.member_name}</td>
                <td className="px-4 py-4">
                  <Link
                    to={`/admin/family/${item.family_id}/preview`}
                    className="px-2 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200"
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
      <div className="text-sm text-center text-gray-500">No data found</div>
    )}

    {/* Pagination */}
    <div className="relative flex flex-col items-center justify-center gap-3 mt-4 sm:flex-row sm:justify-between sm:gap-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(CurrentPage - 1)}
          disabled={CurrentPage === 1}
          className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${
            CurrentPage ? "bg-lavender--600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {CurrentPage}
        </button>
        <button
          onClick={() => handlePageChange(CurrentPage + 1)}
          disabled={CurrentPage === TotalPages || TotalPages === 0}
          className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded">
          Total Page: {TotalPages}
        </span>
        <span
          onClick={() => handlePageChange(TotalPages)}
          className={`px-3 py-1 text-sm ${
            TotalPages === CurrentPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-blue-600 hover:text-blue-800 cursor-pointer"
          } rounded`}
        >
          Last Page
        </span>
      </div>
    </div>
  </div>

  {/* Response Message */}
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

export default List;
