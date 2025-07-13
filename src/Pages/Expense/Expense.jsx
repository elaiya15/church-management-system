/* eslint-disable no-undef */
import React, { useEffect, useState ,useRef} from "react";
import { IoIosSearch } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import Dropdown from "../../Components/Helpers/DropDown";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdPrint } from "react-icons/io";
import Modal from "../../Components/Expense/ExpenseFormModal";
import ExpenseTable from "../../Components/Expense/ExpenseTable";
import Pagination from "../../Components/Helpers/Pagination"; // Import Pagination component
import { useForm } from "react-hook-form";
import axios from "axios";
import { URL } from "../../App";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import moment from "moment";
import down from "../../assets/downloade.svg";

export default function Expense() {

  const abortControllerRef = useRef(null);  // Ref for AbortController
  const debounceTimeoutRef = useRef(null); 
   // Ref for debounce timeout
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const token = window.localStorage.getItem("token");
  const [callCategories, setCallCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseImg, setExpenseImg] = useState();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [date, setDate] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" }); 

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(null);

  const [Response, setResponse] = useState({
    status: null,
    message: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    // setFromDate(today);
    // setToDate(today);
  }, [date]);

  const [formCategory, setFormCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      
      if(dateRange.from && dateRange.to){
        const category= await fetchCategories();
        const Data = await fetchExpenses(
          currentPage,
          searchQuery,
          dateRange.from,
          dateRange.to,
          selectedCategory
        );

        setCategories(["All", ...category]);
        setExpenses(Data.Expenses);
        setTotalPages(Data.pages);
        setFormCategory(category);
        setTotalAmount(Data.totalAmount);
      }
    
      const categoryData = await fetchCategories();
      const expenseData = await fetchExpenses(
        currentPage,
        searchQuery,
        dateRange.from,
        dateRange.to,
        selectedCategory
      );

      setCategories(["All", ...categoryData]);
      setExpenses(expenseData.Expenses);
      setTotalPages(expenseData.pages);
      setFormCategory(categoryData);
      setTotalAmount(expenseData.totalAmount);


    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      
      if(dateRange.from && dateRange.to){
        const category= await fetchCategories();
        const Data = await fetchExpenses(
          currentPage,
          searchQuery,
          dateRange.from,
          dateRange.to,
          selectedCategory
        );

        setCategories(["All", ...category]);
        setExpenses(Data.Expenses);
        setTotalPages(Data.pages);
        setFormCategory(category);
        setTotalAmount(Data.totalAmount);
      setCurrentPage(1);

      }
    
      const categoryData = await fetchCategories();
      const expenseData = await fetchExpenses(
        currentPage,
        searchQuery,
        dateRange.from,
        dateRange.to,
        selectedCategory
      );

      setCategories(["All", ...categoryData]);
      setExpenses(expenseData.Expenses);
      setTotalPages(expenseData.pages);
      setFormCategory(categoryData);
      setTotalAmount(expenseData.totalAmount);
      setCurrentPage(1)

    };
    fetchData();
  }, [ searchQuery, dateRange, selectedCategory]);


  const [newCategory, setNewCategory] = useState(false);
  // API for fetching categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URL}/expense/categories`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
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
    }
  };
  

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const fetchExpenses = async (
    page,
    searchQuery,
    fromDate,
    toDate,
    category,
    signal
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URL}/expense/category?page=${page}&limit=15&search=${searchQuery}&fromdate=${fromDate}&todate=${toDate}&category=${
          category !== "All" ? category : ""
        }`, {
          headers: {
            Authorization: token,
          },
          signal: signal,  // Pass the signal to axios
        }
      );
      return response.data;
    } catch (error) {
      if (error.name !== "AbortError" && error.response?.status === 401) {
        setResponse({
          status: "Failed",
          message: "Un Authorized! Please Login Again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      }
      if (error.name !== "AbortError" && error.response?.status === 500) {
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
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    // Clear the previous debounce timeout and abort the ongoing request
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Cancel the ongoing API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the new search
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const searchValue = e.target.value;
    setSearchQuery(searchValue);

    // Debounce the search query
    debounceTimeoutRef.current = setTimeout(async () => {
      if (searchValue) {
        try {
          const expenseData = await fetchExpenses(
            currentPage,
            searchValue,
            fromDate,
            toDate,
            selectedCategory,
            signal
          );
          setExpenses(expenseData.Expenses);
          setTotalPages(expenseData.pages);
          setTotalAmount(expenseData.totalAmount);
        } catch (error) {
          if (error.name === "AbortError") {
            // Ignore AbortError when the request is aborted
            console.log("Search request aborted");
          } else {
            console.error("Error fetching expenses", error);
          }
        }
      }
    }, 500); // 500 ms debounce delay
  };



  const handleSelect = (item) => {
    setSelectedCategory(item);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewCategory(false);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCategory(false);
    reset();
  };

  // new expense post form functions
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("date", data.date);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("image", expenseImg);

    try {
      const res = await axios.post(`${URL}/expense/add`, formData, {
        headers: {
          Authorization: token,
        },
      });
      setNewCategory(false);
      reset();
      setExpenseImg("");
      setIsModalOpen(false);
      // setIsSuccess()
      const expenseData = await fetchExpenses(
        currentPage,
        searchQuery,
        fromDate,
        toDate,
        selectedCategory
      );

      // console.log(expenseData);
      setExpenses(expenseData.Expenses);
      setTotalPages(expenseData.pages); // Update total pages if necessary
    } catch (error) {
      console.log(error);
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
    }
  };

  // image
  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.id = "imageUpload";
    input.accept = "image/*";
    input.className = "hidden";
    input.onchange = handleImageChange;
    input.click();
  };
  // image on change function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpenseImg(file);
    }
  };

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    setToday(`${year}-${month}-${day}`);
  }, []);

  // const handleSearch  = (e) => {
  //   setSearchQuery(e.target.value);
  // };

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
    
  // const handleDownloadPDF = async () => {
  //   console.log("Generating Expense Report PDF...");
    
  //   try {
  //     // Fetch expenses data for PDF
  //     const response = await axios.get(
  //       `${URL}/expense/category?search=${searchQuery}&fromdate=${fromDate}&todate=${toDate}&category=${
  //         selectedCategory !== "All" ? selectedCategory : ""
  //       }&download=true`,
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     console.log( response.data);
  //     console.log( response.data?.Expenses);
      

  //     const Data = response.data?.Expenses || [];
  
  //     if (!Data.length) {
  //       console.error("No data available to generate the PDF.");
  //       return;
  //     }
  
  //     // Table headings and data rows
  //     const tableHeading = ["SI.No.", "Category", "Date", "Amount", "Description"];
  //     const rows = Data.map((item, index) => [
  //       index + 1,
  //       item.category || "N/A",
  //       moment(item.date).format("DD-MM-YYYY"),
  //       item.amount || "N/A",
  //       item.description || "N/A",
  //     ]);
  
  //     // Initialize jsPDF and generate the table
  //     const doc = new jsPDF();
  //     const headers = [tableHeading];
  
  //     doc.autoTable({
  //       head: headers,
  //       body: rows,
  //       styles: { halign: "center" },
  //       startY: 20,
  //     });
  
  //     // Save the PDF
  //     doc.save(`Expense_Reports_${fromDate}_to_${toDate}.pdf`);
  //     console.log("PDF generated successfully!");
  
  //   } catch (error) {
  //     console.error("Error occurred while generating PDF:", error);
  
  //     if (error.response?.status === 401) {
  //       setResponse({
  //         status: "Failed",
  //         message: "Unauthorized! Please log in again.",
  //       });
  //       setTimeout(() => {
  //         window.localStorage.clear();
  //         navigate("/");
  //       }, 5000);
  //     } else if (error.response?.status === 500) {
  //       setResponse({
  //         status: "Failed",
  //         message: "Server Unavailable!",
  //       });
  //       setTimeout(() => {
  //         setResponse({
  //           status: null,
  //           message: "",
  //         });
  //       }, 5000);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const handleDownloadPDF = async () => { 
    console.log("Generating Expense Report PDF...");
    
    try {
      // Fetch expenses data for PDF
      const response = await axios.get(
        `${URL}/expense/category?search=${searchQuery}&fromdate=${fromDate}&todate=${toDate}&category=${
          selectedCategory !== "All" ? selectedCategory : ""
        }&download=true`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      const Data = response.data?.Expenses || [];
    
      if (!Data.length) {
        console.error("No data available to generate the PDF.");
        return;
      }
  
      // Calculate total amount
      const totalAmount = Data.reduce((sum, item) => sum + (item.amount || 0), 0);
  
      // Table headings and data rows
      const tableHeading = ["SI.No.", "Category", "Date", "Amount", "Description"];
      const rows = Data.map((item, index) => [
        index + 1,
        item.category || "N/A",
        moment(item.date).format("DD-MM-YYYY"),
        item.amount || "N/A",
        item.description || "N/A",
      ]);
  
      // Initialize jsPDF
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
  
      doc.autoTable({
        head: headers,
        body: rows,
        styles: { halign: "center" },
        margin: { top:35, left: 10, right: 10 }, // Adjusts table margins
        didDrawPage: function () {
          addTitle(doc, "Expense Report", totalAmount); // Add title & total amount on every page
        },
      });
  
      // Save the PDF
      doc.save(`Expense_Reports_${fromDate}_to_${toDate}.pdf`);
      console.log("PDF generated successfully!");
  
    } catch (error) {
      console.error("Error occurred while generating PDF:", error);
  
      if (error.response?.status === 401) {
        setResponse({
          status: "Failed",
          message: "Unauthorized! Please log in again.",
        });
        setTimeout(() => {
          window.localStorage.clear();
          navigate("/");
        }, 5000);
      } else if (error.response?.status === 500) {
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
      setLoading(false);
    }
  };
  

  return (
    <div>
      {isSuccess && <SuccessMessage Message="New Expenses added" />}
      <div className="flex items-end justify-between px-3 space-x-11">
        <div className="text-xl font-bold">Expense</div>
       
         <div className="flex space-x-5">
         { fromDate && toDate? <button
              onClick={handleDownloadPDF}
              className="mr-4 text-blue-600 cursor-pointer hover:text-blue-800"
            >
              <img src={down} />
            </button>:null}
            </div>
      </div>
      {/* filter options and table */}
      <div className="h-full p-2 mx-1 mt-3 bg-white shadow-md rounded-xl">
        <div className="flex flex-wrap items-center justify-between p-4 space-x-3 space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex flex-col items-start w-full px-1 space-y-2 border rounded-lg lg:flex-row lg:items-center lg:space-y-0 lg:space-x-0 lg:w-auto">
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
          <div className="flex flex-col items-start w-full px-1 space-y-2 border rounded-lg lg:flex-row lg:items-center lg:space-y-0 lg:space-x-0 lg:w-auto">
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

          <div className="w-full lg:w-auto">
            <Dropdown
              items={categories}
              onSelect={handleSelect}
              label="Category"
            />
          </div>

          {/* <span className="flex items-center w-full px-1 border rounded-lg lg:w-auto">
            <IoIosSearch />
            <input
              type="text"
              placeholder={`Search....`}
              className="flex-grow border-0 focus:ring-0"
              value={searchQuery}
              onChange={handleSearch}
            />
          </span> */}

          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
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
              className="block py-1 text-sm text-gray-900 rounded w-54 ps-8 bg-gray-50 focus:ring-lavender--600 focus:border-lavender--600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lavender--600 dark:focus:border-lavender--600"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="w-full lg:w-auto">
            <button
              onClick={handleOpenModal}
              className="flex items-center w-full gap-2 px-5 py-2 text-white bg-purple-500 rounded-lg lg:w-auto"
            >
              <FaPlus /> Add Expense
            </button>
          </div>
        </div>

        <ExpenseTable expenses={expenses} loading={loading} CurrentPage={currentPage}/>

        {totalAmount ? (
          <div className="w-1/2 pt-10 mx-auto">
            <h6 className="font-bold text-end lg:text-xl">
              Total Amount :{" "}
              <span className="text-2xl text-lavender--600">{totalAmount.toLocaleString("en-IN")}</span>
            </h6>
          </div>
        ) : null}
        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        /> */}
        
<div className="flex items-center justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentPage
                ? "bg-lavender--600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 w-[100px] text-gray-700 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
          <div className="absolute flex px-3 space-x-2 rounded right-10 ">
  <span  className="px-4 py-2 text-center text-gray-700 bg-gray-100 rounded" >Total Page: <span >{totalPages}</span>
 </span>
 <span
  onClick={() => setCurrentPage(totalPages)}
  className={`${totalPages === currentPage ? 'disabled opacity-50  bg-gray-100 px-4 py-2 cursor-not-allowed' : 'px-4 py-2 text-blue-400 bg-gray-100 rounded active:text-blue-800 hover:cursor-pointer'} `}
>
  Last Page
</span>
 </div>
        </div>
      </div>

      {/* NEW EXPENSE FORM MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Date
              </label>
              <input
                defaultValue={date}
                type="date"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="flex items-center justify-between text-lg font-medium text-gray-700">
                Category{" "}
                <span
                  className="text-sm text-purple-500 underline cursor-pointer"
                  onClick={() => setNewCategory(true)}
                >
                  Add category
                </span>
              </label>
              {newCategory || formCategory.length === 0 ? (
                <input
                  type="text"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />
              ) : (
                <select
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select a category</option>
                  {formCategory.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Amount
              </label>
              <input
                type="text"
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
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Image
              </label>
              <div
                className={`w-full border border-dashed border-lavender--600 p-2 rounded-md text-center underline  cursor-pointer ${
                  expenseImg
                    ? "border-green-500 text-green-500"
                    : "border-lavender--600  text-lavender--600"
                }`}
                onClick={handleUploadClick}
              >
                {expenseImg ? "Uploaded" : " Upload Image"}
              </div>
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="">
            <label className="block my-3 text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full h-32 border rounded-lg"
              {...register("description")}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-red-500 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              onClick={handleCloseModal}
            >
              Discard
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-lavender--600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Save Expense
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
