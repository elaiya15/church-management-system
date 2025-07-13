import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import './pagination.css'; // Ensure this path is correct

import down from './icon/downloade.svg';
import print from './icon/print.svg';

const URL = import.meta.env.VITE_BACKEND_API_URL;

const tableHeading = [
  'Sl. no.',
  'Member ID',
  'Member Name',
  'Marriage Date',
  'Family ID',
  'Status',
];

const ReportPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Zero-based index for pagination
  const [itemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const componentRef = useRef();

  // AbortController reference
  const abortControllerRef = useRef(new AbortController());

  // Fetch data function with AbortController
  const fetchData = async (signal) => {
    try {
      const response = await axios.get(`${URL}/reports/marriage`, {
        params: {
          status: statusFilter !== 'All' ? statusFilter : undefined,
          fromdate: dateRange.from || undefined,
          todate: dateRange.to || undefined,
          search: searchTerm || undefined,
          page: currentPage + 1, // API expects 1-based index
          limit: itemsPerPage,
        },
        signal, // Pass the abort signal
      });
      setData(response.data.Marriage);
      setFilteredData(response.data.Marriage);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error fetching data:', error);
      }
    }
  };

  // Debounce effect for API calls
  const debounceFetchData = useRef(null);

  useEffect(() => {
    // Clear the debounce timeout
    clearTimeout(debounceFetchData.current);

    // Debounced fetch data logic
    debounceFetchData.current = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cancel the previous request
      }
      const newController = new AbortController(); // Create a new AbortController
      abortControllerRef.current = newController; // Update the reference
      fetchData(newController.signal); // Fetch data with the new signal
    }, 1000); // Debounce delay of 500ms

    return () => {
      clearTimeout(debounceFetchData.current); // Cleanup debounce timeout
    };
  }, [statusFilter, searchTerm, currentPage]);

  // Fetch data when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cancel the previous request
      }
      const newController = new AbortController();
      abortControllerRef.current = newController;
      fetchData(newController.signal);
    }else if(!dateRange.from && !dateRange.to){
      // Clear previous debounce timeout and set a new one
clearTimeout(debounceFetchData.current);

// Debounced function to fetch data
debounceFetchData.current = setTimeout(() => {
// Cancel the previous request before making a new one
abortControllerRef.current.abort();
abortControllerRef.current = new AbortController(); // Create a new instance for next request
return fetchData();
}, 100); }
  }, [dateRange]);



  

  useEffect(() => {
    setCurrentPage(0); // Reset to the first page when search or date range changes
  }, [searchTerm, dateRange]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();
  //   const headers = [tableHeading];
  //   const rows = filteredData.map((item, index) => [
  //     index + 1,
  //     item.member_id,
  //     item.member_name,
  //     moment(item.marriage_date).format('YYYY-MM-DD'),
  //     item.secondary_family_id || item.primary_family_id,
  //     item.status,
  //   ]);

  //   doc.autoTable({
  //     head: headers,
  //     body: rows,
  //   });

  //   doc.save('MarriageReports.pdf');
  // };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Function to add title on each page
    const addTitle = (doc, title) => {
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });
    };
  
    const headers = [
          tableHeading,
        ];
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.member_id,
      item.member_name,
      moment(item.baptized_date).format("YYYY-MM-DD"),
      item.secondary_family_id || item.primary_family_id,
      item.status,
    ]);
  
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 25, // Push table down
      margin: { top: 25 ,left: 10,right:10 }, // Ensure title does not overlap
      didDrawPage: (data) => {
        addTitle(doc, "Marriage Reports"); // Ensure title is added before table
      },
    });
  
    doc.save("MarriageReports.pdf");
  };


  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <div className="relative h-auto ml-5 w-[100%] bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-lavender--600">
            MarriageReports
          </h2>
          <div className="flex gap-x-5">
            <button
              onClick={handleDownloadPDF}
              className="mr-4 text-blue-600 cursor-pointer hover:text-blue-800"
            >
              <img src={down} />
            </button>
            {/* Uncomment if print functionality is needed */}
            {/* <button onClick={handlePrint} className="text-blue-600 cursor-pointer hover:text-blue-800">
              <img src={print} />
            </button> */}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div>
            <label className="block mb-1 text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Search</label>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div ref={componentRef}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {tableHeading.map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-2 text-left border-b text-base text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item, index) => (
                <tr
                  key={index}
                  className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <td className="px-4 text-sm py-2">{offset + index + 1}</td>
                  <td className="px-4 text-sm py-2">{item.member_id}</td>
                  <td className="px-4 text-sm py-2">{item.member_name}</td>
                  <td className="px-4 text-sm py-2">
                    {moment(item.marriage_date).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-4 text-sm py-2">
                    {item.secondary_family_id || item.primary_family_id}
                  </td>
                  <td className="px-4 text-sm py-2">
                    <span
                      className={`text-${
                        item.status === 'Active' ? 'green' : 'red'
                      }-500`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div className="flex items-center justify-center">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={Math.ceil(filteredData.length / itemsPerPage)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
