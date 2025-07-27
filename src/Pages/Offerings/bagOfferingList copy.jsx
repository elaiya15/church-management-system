/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosSearch, IoMdPrint } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import Dropdown from "../../Components/Helpers/DropDown";
import OfferingTable from "../../Components/Offerings/BagOfferingsTable";
import Modal from "../../Components/Expense/ExpenseFormModal";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../../App";
import axios from "axios";
import Pagination from "../../Components/Helpers/Pagination";
import { MdVerified } from "react-icons/md";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import down from "../../assets/downloade.svg";
import jsPDF from "jspdf";
import moment from "moment";


export default function OfferingList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [Offerings, setOfferings] = useState([]);
  const [serverError, setServerError] = useState("");
  const [CurrentPage, setCurrentPage] = useState(1);
  const [TotalPages, setTotalPages] = useState(1);
  const [memberError, setMemberError] = useState("");
  const [checkingMember, setCheckingMember] = useState(false);
  // const [checking_NO_Name_MemberID, setChecking_NO_Name_MemberID] = useState(true);
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const token = window.localStorage.getItem("token");
  const [dateRange, setDateRange] = useState({ from: "", to: "" }); 
  console.log(category);
  
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
 
  const checking_NO_Name_MemberID = category === "NO_Name_Offerings" ?  false:true ;
  // console.log(checking_NO_Name_MemberID);

const MemberDisable= checking_NO_Name_MemberID===false?true:false;
// console.log(MemberDisable);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const getCurrentDay = (dateString) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(dateString)
    );
  };
  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });

  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      date: getCurrentDate(),
      day: getCurrentDay(getCurrentDate()),
    },
  });

  // Watch the "date" field
  const selectedDate = watch("date");

  useEffect(() => {
    if (selectedDate) {
      setValue("day", getCurrentDay(selectedDate));
      trigger("day"); // Revalidate field
    }
  }, [selectedDate, setValue, trigger]);

  const navigate = useNavigate();
 
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchOfferings = async (page, searchQuery, fromDate, toDate) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancel the previous request
    }
    abortControllerRef.current = new AbortController(); // Create a new AbortController
  
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/bagOfferings/category`, {
        params: {
          category,
          page,
          limit: 15,
          search: searchQuery,
          fromdate: fromDate,
          todate: toDate,
        },
        headers: {
          Authorization: token,
        },
        signal: abortControllerRef.current.signal, // Pass the signal here
      });
  
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error fetching offerings:", error);
        setOfferings([]);
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const debounceFetch = (page, query, from, to) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchOfferings(page, query, from, to).then((data) => {
        setOfferings(data?.bagOfferings || []);
        // setCurrentPage(page||1);
        setTotalPages(data?.totalPages || 1);
        setTotalAmount(data?.totalAmount || 0);
      });
    }, 200);
  };

  useEffect(() => {
    debounceFetch(CurrentPage, searchQuery, dateRange.from, dateRange.to);
    
  }, [CurrentPage]);
  useEffect(() => {
    setCurrentPage(1)
    debounceFetch(CurrentPage, searchQuery, dateRange.from, dateRange.to);
    
  }, [ searchQuery ,dateRange]);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setValue("date", today);
  }, [setValue]);

  const handleOpenModal = () => {
    setMemberError("");
    setCheckingMember(false);
    setMemberDetails(null);
    setIsModalOpen(true);
    reset();
  };

  const handleCloseModal = () => {
    setMemberError("");
    setCheckingMember(false);
    setMemberDetails(null);
    setIsModalOpen(false);
    reset();
  };

  

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    if (e.target.value && toDate) {
      setDateRange({ from: e.target.value, to: toDate });
    }
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    if (fromDate && e.target.value) {
      setDateRange({ from: fromDate, to: e.target.value });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
  };

  const today = new Date().toISOString().split("T")[0];
  const onSubmit = async (formData) => {
    formData.category = category;

    try {
      const res = await axios.post(`${URL}/bagOfferings/add`, formData, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res);
      reset();
      setIsModalOpen(false);
      const offeringData = await fetchOfferings(
        CurrentPage,
        searchQuery,
        fromDate,
        toDate
      );
      setOfferings(offeringData.bagOfferings);
      setTotalAmount(offeringData.totalAmount);

      setTotalPages(offeringData.pages);
      
    } catch (error) {
      console.log(error);
      setServerError(error?.response?.data?.message);
      if (error.response.status === 401) {
        window.localStorage.clear();
        navigate("/");
      }
    }
  };



const handleDownloadPDF = async () => { 
  try {
    const response = await axios.get(
      `${URL}/bagOfferings/category?category=${category}&fromdate=${fromDate}&todate=${toDate}&download=true`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const Data = response.data.bagOfferings;
    
    // Calculate total amount
    // const totalAmount = Data.reduce((sum, item) => sum + item.amount, 0);
    // const totalAmount = totalAmount;

    const tableHeading = [
      "SI.No.", 
      "Date",
      "Day",
      "Amount",
      "Description",
    ].filter(Boolean); // Remove empty strings

    const doc = new jsPDF();

    // Function to add title and total amount
    const addTitle = (doc, title, totalAmount) => {
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });

      // Add total amount on the right side
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const pageWidth = doc.internal.pageSize.width; // Get page width
      const textWidth = doc.getTextWidth(`Total Amount : ${totalAmount}`); // Measure text width
      doc.text(`Total Amount : ${totalAmount}`, pageWidth - textWidth - 10, 25); // Align to right
    };

    const headers = [tableHeading];
       let rows =Data.map((item, index) => [
        index + 1,
        moment(item.date).format('YYYY-MM-DD'),
        moment(item.date).format('dddd'),
        item.amount,
        item.description,
      ]);
   
   

    
    doc.autoTable({
      head: headers,
      body: rows,
      styles: { halign: 'center' },
      margin: { top: 35 ,left: 10, right: 10}, // Ensure table doesn't overlap title
      didDrawPage: function () {
        addTitle(doc, category, totalAmount); // Add title & total amount on every page
      },
    });

    doc.save(`${category} Report.pdf`);
    console.log("PDF generated successfully!");

  } catch (error) {
    console.error("Error during API call:", error);
  }
};


  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between px-3 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-11">
        <div className="text-xl font-bold capitalize">{category}</div>
    
      </div>

      <div className="h-full p-5 mx-1 mt-3 bg-white shadow-md rounded-xl ">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          <div className="flex flex-wrap items-center p-4 space-x-3 space-y-3 lg:space-y-0 lg:space-x-3">
            <div className="flex flex-col items-start w-full px-1 space-y-2 border rounded-lg lg:flex-row lg:items-center lg:space-y-0 lg:w-auto">
              <label htmlFor="from-date" className="text-gray-700">
                From:
              </label>
              <input
                type="date"
                id="from-date"
                className="px-2 py-1 border-0 rounded focus:ring-0"
                max={today}
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>

            <div className="flex flex-col items-start w-full px-1 space-y-2 border rounded-lg lg:flex-row lg:items-center lg:space-y-0 lg:w-auto">
              <label htmlFor="to-date" className="text-gray-700">
                To:
              </label>
              <input
                type="date"
                id="to-date"
                className="px-2 py-1 border-0 rounded focus:ring-0"
                max={today}
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              
              </div>
            
            </div>
          </div>
          <div className="flex w-full gap-x-4 lg:w-auto">
         { fromDate && toDate? <button
              onClick={handleDownloadPDF}
              className="mr-4 text-blue-600 cursor-pointer hover:text-blue-800"
            >
              <img src={down} />
            </button>:null}
            <button
              onClick={handleOpenModal}
              className="flex items-center w-full gap-2 px-5 py-2 text-white bg-purple-500 rounded-lg lg:w-auto"
            >
              <FaPlus /> Add Offering
            </button>
          </div>
        </div>

        <OfferingTable offerings={Offerings} loading={loading} Data={MemberDisable} CurrentPage={CurrentPage}/>

        {totalAmount && (
          <div className="w-1/2 pt-10 mx-auto">
            <h6 className="font-bold text-end lg:text-xl">
              Total Amount :{" "}
              <span className="text-2xl text-lavender--600">  {totalAmount.toLocaleString("en-IN")}
              </span>
            </h6>
          </div>
        )}

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
      
        /> */}

<div className="flex items-center justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(CurrentPage - 1)}
            disabled={CurrentPage === 1}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            className={`px-4 py-2 rounded ${
              CurrentPage
                ? "bg-lavender--600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {CurrentPage}
          </button>
          <button
            onClick={() => setCurrentPage(CurrentPage + 1)}
            disabled={CurrentPage === TotalPages || TotalPages === 0}
            className="px-4 py-2 w-[100px] text-gray-700 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
          <div className="absolute flex px-3 space-x-2 rounded right-10 ">
  <span  className="px-4 py-2 text-center text-gray-700 bg-gray-100 rounded" >Total Page: <span >{TotalPages}</span>
 </span>
 <span
  onClick={() => setCurrentPage(TotalPages)}
  className={`${TotalPages === CurrentPage ? 'disabled opacity-50  bg-gray-100 px-4 py-2 cursor-not-allowed' : 'px-4 py-2 text-blue-400 bg-gray-100 rounded active:text-blue-800 hover:cursor-pointer'} `}
>
  Last Page
</span>
 </div>
        </div>
      </div>


      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="New Offering"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {memberDetails?.member?.member_photo && (
            <div className="flex justify-end">
              <img
                src={`data:image/*;base64,${memberDetails?.member?.member_photo}`}
                alt="Profile Image"
                className="w-[50px] h-[50px] rounded"
              />
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
              <label
                htmlFor="date"
                className="block text-lg font-medium text-gray-700"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

          <div>
              <label className="block text-lg font-medium text-gray-700">Day</label>
              <input
                type="text"
                readOnly
                value={watch("day")}
                className="block w-full mt-1 bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm"
                {...register("day")}
              />
            </div> 

            {/* <div>
              <label
                htmlFor="member_name"
                className="block text-lg font-medium text-gray-700"
              >
              {MemberDisable ? 'Name' : ' Member Name'}  
              </label>
              <input
                id="member_name"
                type="text"
                disabled={checking_NO_Name_MemberID}
                placeholder= {MemberDisable ? 'Enter Name' : 'Enter Member Name '}  
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("member_name", {
                  required: "Invalid member ID. Please check and try again.",
                })}
              />
              {errors.member_name && (
                <p className="text-sm text-red-500">
                  {errors.member_name.message}
                </p>
              )}
            </div> */}

          
            <div>
              <label
                htmlFor="amount"
                className="block text-lg font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                id="amount"
                type="text"
                placeholder="Rs"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message:
                      "Amount should be a number with up to two decimal places",
                  },
                })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Enter Description"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-red-500 border border-transparent rounded-md focus:outline-none focus:ring-0 sm:text-sm"
              onClick={handleCloseModal}
            >
              Discard
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-0 sm:text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

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
