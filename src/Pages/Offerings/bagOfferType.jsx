import React, { useEffect, useState } from "react";
import MoneyIcon from "../../assets/Group 1000002038-min.png";
import AddIcon from "../../assets/add-min.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";
import Spinners from "../../Components/Spinners";
import { useForm } from "react-hook-form";
import Modal from "../../Components/Expense/ExpenseFormModal";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

export default function OfferType() {
    console.log(URL);
    
  const [category, setCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [Response, setResponse] = useState({ status: null, message: "" });
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  // Function to get today's date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // Function to get today's day name
  const getCurrentDay = (dateString) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date(dateString)
    );
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URL}/bagOfferings/categories`, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      handleServerError(error);
    }
  };

  const handleServerError = (error) => {
    if (error.response?.status === 401) {
      setResponse({ status: "Failed", message: "Unauthorized! Please Login Again." });
      setTimeout(() => {
        window.localStorage.clear();
        navigate("/");
      }, 3000);
    } else if (error.response?.status === 500) {
      setResponse({ status: "Failed", message: "Server Unavailable!" });
      setTimeout(() => setResponse({ status: null, message: "" }), 3000);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      const res = await axios.post(`${URL}/bagOfferings/add`, data, {
        headers: { Authorization: token },
      });
      console.log("Response:", res);
      reset();
      setIsModalOpen(false);
      setCategory(await fetchCategories());
    } catch (error) {
      console.error("Error:", error);
      handleServerError(error);
      setServerError(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    reset();
  };

  if (loading) {
    return (
      <div className="h-3/4 flex justify-center items-center">
        <Spinners />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-start gap-10">
        {category?.map((type) => (
          <div
            key={type}
            onClick={() => navigate(`/admin/offerings/BagOffer/list/${type}`)}
            className="bg-white cursor-pointer flex flex-col items-center justify-center space-y-4 w-full sm:w-[48%] md:w-[30%] lg:w-[22%] h-[100px] shadow-md rounded-lg"
          >
            <img src={MoneyIcon} className="w-[30px] h-[30px]" alt={type} />
            <span className="text-xl text-lavender--600 font-bold capitalize">
              {type}
            </span>
          </div>
        ))}

        <div
          onClick={handleOpenModal}
          className="bg-white cursor-pointer flex flex-col items-center justify-center space-y-4 w-full sm:w-[48%] md:w-[30%] lg:w-[22%] h-[100px] rounded-lg border-2 border-dashed border-lavender--600"
        >
          <img src={AddIcon} className="w-[30px] h-[30px]" alt="New Offerings" />
          <span className="text-md" style={{ color: "rgba(163, 97, 216, 1)" }}>
            New Offerings
          </span>
        </div>
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="New Offering">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">New Category</label>
              <input
                type="text"
                placeholder="Enter new category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("category", { required: "Category name is required" })}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Amount</label>
              <input
                type="text"
                placeholder="Rs"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("amount", {
                  required: "Amount is required",
                  pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount format" },
                })}
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Day</label>
              <input
                type="text"
                readOnly
                value={watch("day")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
                {...register("day")}
              />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register("description")}
            />
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button type="button" className="text-red-500" onClick={handleCloseModal}>
              Discard
            </button>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
