import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // console.log(currentPage);
  // console.log(totalPages);
  return (
    <div className="flex justify-center items-center space-x-2 my-3 pt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <button
        className={`px-4 py-2 rounded ${
          currentPage ? "bg-lavender--600 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {currentPage}
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 w-[100px] bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

