import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { URL } from "../../App";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Spinners from "../../Components/Spinners";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import down from "../../assets/downloade.svg";
import jsPDF from "jspdf";
import Dropdown from "../../Components/Helpers/DropDown";

function List() {
  const token = window.localStorage.getItem("token");
  const [categories, setCategories] = useState(["All", "Active", "Inactive"]);
  const navigate = useNavigate();
  const location = useLocation();
  const [Data, setData] = useState([]);
  const [CurrentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [Search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // Use a ref to store the AbortController
  const abortControllerRef = useRef(null);

  // Load search and status from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const pageParam = parseInt(params.get("page")) || 1;
    const statusParam = params.get("status") || "All";

    setSearch(searchParam);
    setCurrentPage(pageParam);
    setSelectedCategory(statusParam);

    fetchData(pageParam, searchParam, statusParam);
  }, [location.search]);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Skip on the first render
      return;
    }

    const params = new URLSearchParams();
    if (Search) {
      params.append("search", Search);
    }
    if (CurrentPage) {
      params.append("page", CurrentPage);
    }
    if (selectedCategory) {
      params.append("status", selectedCategory);
    }
    navigate(`?${params.toString()}`, { replace: true });
  }, [Search, CurrentPage, selectedCategory, navigate]);

  const fetchData = async (page, search, status) => {
    // Abort the previous request if one exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the current request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const { signal } = abortController;

    setLoading(true);
    try {
      const statusQuery = status === "All" ? "" : status;
      const response = await axios.get(
        `${URL}/pastor/list?search=${search}&page=${page}&limit=15&status=${statusQuery}`,
        {
          headers: {
            Authorization: token,
          },
          signal, // Pass the signal to Axios
        }
      );

      setData(response.data.RegisteredData);
      setTotalPages(response.data.TotalPages);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error);
        if (error.response) {
          if (error.response.status === 401) {
            setResponse({
              status: "Failed",
              message: "Unauthorized! Please Login Again.",
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
        } else {
          setResponse({
            status: "Failed",
            message: "An unexpected error occurred",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setSelectedCategory(item); // Update selected category (status)
  };

  //   const handleDownloadPDF = async () => {
  //     setIsDownloading(true);
  //     try {
  //       const statusQuery = selectedCategory === "All" ? "" : selectedCategory;
  //       const res = await axios.get(
  //         `${URL}/member/download-list?status=${statusQuery}`,
  //         {
  //           headers: {
  //             Authorization: token,
  //           },
  //         }
  //       );

  //       const Data = res.data.RegisteredData;
  //       const doc = new jsPDF();

  //       // **Define the Title**
  //       const title =
  //         selectedCategory === "All"
  //           ? "Paster List"
  //           : `${selectedCategory} Paster List`;

  //       // **Function to Add Title on Every Page**
  //       const addTitle = (doc, title) => {
  //         doc.setFontSize(18);
  //         doc.setFont("helvetica", "bold");
  //         doc.text(title, 105, 15, { align: "center" }); // Title stays at the same Y-position
  //       };

  //       // **AutoTable Plugin with Proper Title Positioning**
  //       doc.autoTable({
  //         head: [
  //           [
  //             "SI.No.",
  //             "Member ID",
  //             "Member Name",
  //             "Family ID",
  //             "Family Head Name",
  //             "Status",
  //           ],
  //         ],
  //         body: Data.map((item, index) => [
  //           index + 1,
  //           item.member_id,
  //           item.member_name,
  //           item.family_id,
  //           item.family_head_name,
  //           item.status,
  //         ]),
  //         startY: 30, // Ensure space below the title
  //         margin: { top: 35 }, // Push table down to avoid title overlap
  //         didDrawPage: function () {
  //           addTitle(doc, title); // Add title on every page
  //         },
  //       });

  //       // **Save the PDF**
  //       doc.save(`${title}.pdf`);

  //       console.log("PDF generated successfully!");
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //     } finally {
  //       setIsDownloading(false);
  //     }
  //   };

  return (
<>
  {isDownloading && (
    <div className="p-2 font-semibold text-center text-blue-500 bg-blue-100 rounded-md">
      Your download is in progress, please wait...
    </div>
  )}

  <div className="relative w-full p-5 mt-5 space-y-6 bg-white rounded-t-lg">
    {/* Top Controls */}
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h1 className="text-lg font-semibold text-lavender--600">Pastor List</h1>

      <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:space-x-5 sm:w-auto">
        <Dropdown
          items={categories}
          onSelect={handleSelect}
          label="Status"
          selected={selectedCategory}
        />

        <div className="w-full sm:w-auto">
          <label htmlFor="default-search" className="sr-only">
            Search Members
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
            <input
              type="search"
              id="default-search"
              className="w-full py-2 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-lavender--600 focus:border-lavender--600"
              placeholder="Search Members..."
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Data Table */}
    {loading ? (
      <Spinners />
    ) : Data && Data.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-base text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {["Sl.No", "Pastor Id", "Pastor Name", "Pastor Family Id", "Status", "Action"].map(
                (item, index) => (
                  <th key={index} className="px-4 py-3 whitespace-nowrap">
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Data.map((item, index) => (
              <tr
                key={item.member_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-4 py-4 text-sm">
                  {(CurrentPage - 1) * 15 + (index + 1)}
                </td>
                <td className="px-4 py-4 text-sm">{item.member_id}</td>
                <td className="px-4 py-4 text-sm">{item.member_name}</td>
                <td className="px-4 py-4 text-sm">{item.familyId}</td>
                <td
                  className={`${
                    item.status === "Active" ? "text-green-600" : "text-red-600"
                  } px-4 py-4 text-sm font-semibold`}
                >
                  {item.status}
                </td>
                <td className="flex gap-3 px-4 py-4 text-sm">
                  <Link
                    to={`/admin/pastor/${item.member_id}/preview`}
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
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            <tr>
              <td
                colSpan="7"
                className="px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400"
              >
                No members found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}

    {/* Pagination */}
    <div className="relative flex flex-wrap items-center justify-between gap-3 mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(CurrentPage - 1)}
          disabled={CurrentPage === 1}
          className="w-24 px-4 py-2 text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button className="px-4 py-2 text-white rounded bg-lavender--600">
          {CurrentPage}
        </button>

        <button
          onClick={() => setCurrentPage(CurrentPage + 1)}
          disabled={CurrentPage === TotalPages || TotalPages === 0}
          className="w-24 px-4 py-2 text-gray-700 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <span className="px-4 py-2 text-center text-gray-700 bg-gray-100 rounded">
          Total Page: <span>{TotalPages}</span>
        </span>
        <span
          onClick={() => setCurrentPage(TotalPages)}
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

  {/* Toast Messages */}
  {Response.status !== null &&
    (Response.status === "Success" ? (
      <SuccessMessage Message={Response.message} />
    ) : Response.status === "Failed" ? (
      <FailedMessage Message={Response.message} />
    ) : null)}
</>



  );
}

export default List;
