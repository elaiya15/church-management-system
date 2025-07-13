import React, { useEffect, useState } from "react";
import MoneyIcon from "../../assets/Group 1000002038-min.png";
import AddIcon from "../../assets/add-min.png";
import CommonModal from "../../Components/CommonModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../App";
import Spinners from "../../Components/Spinners";
import { useForm } from "react-hook-form";
import Modal from "../../Components/Expense/ExpenseFormModal";
import { MdVerified } from "react-icons/md";
import { FailedMessage, SuccessMessage } from "../../Components/ToastMessage";

export default function OfferType() {
  const [category, setCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [checkingMember, setCheckingMember] = useState(false);
  const [memberDetails, setMemberDetails] = useState(null);
  const token = window.localStorage.getItem("token");
  // Get today's date in the format YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
  } = useForm({
    defaultValues: {
      date: getCurrentDate(),
    },
  });

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

  useEffect(() => {
    const memberId = watch("member_id");
    if (memberId) {
      checkMember(memberId);
    }
  }, [watch("member_id")]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await axios.post(`${URL}/offerings/add`, data, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res);
      reset();
      setIsModalOpen(false);
      setCheckingMember(false);
      setMemberError("");
      const category = await fetchCategories();
      setCategory(category);
      setMemberDetails(null);
    } catch (error) {
      console.log(error);
      // if (error.response.status === 401) {
      //   window.localStorage.clear();
      //   navigate("/");
      // }
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
      setServerError(error?.response?.data?.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URL}/offerings/categories`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      // if (error.response.status === 401) {
      //   window.localStorage.clear();
      //   navigate("/");
      // }
      // console.error("Error fetching categories:", error);
      // return [];
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

  const checkMember = async (memberId) => {
    if (memberId.length > 11) {
      setCheckingMember(true);
      setMemberError("");
      try {
        const response = await axios.get(
          `${URL}/offerings/member/verify/${memberId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (response.data) {
          setValue("member_name", response.data.member.member_name);
          setMemberDetails(response.data);
        } else {
          setMemberError("Member ID does not exist.");
          setValue("member_name", "");
          setMemberDetails(null);
        }
      } catch (error) {
        setMemberError("Member not found.");
        setValue("member_name", "");
        setMemberDetails(null);
        if (error.response.status === 401) {
          window.localStorage.clear();
          navigate("/");
        }
      } finally {
        setCheckingMember(false);
      }
    }
  };

  const handleCloseModal = () => {
    setMemberError("");
    setCheckingMember(false);
    setIsModalOpen(false);
    setMemberDetails(null);
    reset();
  };

  const handleOpenModal = () => {
    setMemberError("");
    setCheckingMember(false);
    setIsModalOpen(true);
    setMemberDetails(null);
    reset();
  };

  const bufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const ImageRenderer = ({ imageBuffer }) => {
    if (!imageBuffer || !imageBuffer.data) {
      console.error("Invalid image buffer", imageBuffer);
      return null;
    }

    const base64String = bufferToBase64(imageBuffer.data);
    const imageSrc = `data:image/jpeg;base64,${base64String}`;

    return (
      <img
        src={imageSrc}
        alt="Rendered"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100px",
          maxHeight: "100px",
        }}
      />
    );
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
            onClick={() => navigate(`/admin/offerings/Common/list/${type}`)}
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
          <img
            src={AddIcon}
            className="w-[30px] h-[30px]"
            alt="New Offerings"
          />
          <span className="text-md" style={{ color: "rgba(163, 97, 216, 1)" }}>
            New Offerings
          </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="member_id"
                className="block text-lg font-medium text-gray-700"
              >
                Member Id
              </label>
              <input
                id="member_id"
                type="text"
                placeholder="Enter Member Id"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("member_id", {
                  required: "Member Id is required",
                })}
              />
              {/* <input
                id="member_id"
                type="text"
                placeholder="Enter 12-digit Member Id"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("member_id", {
                  required: "Member Id is required",
                  pattern: {
                    value: /^\d{12}$/,
                    message: "Member Id must be exactly 12 digits",
                  },
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length === 12) {
                    checkMember(value);
                  }
                }}
              /> */}
              {checkingMember && (
                <p className="text-blue-500 text-sm">Checking...</p>
              )}
              {errors.member_id && (
                <p className="text-red-500 text-sm">
                  {errors.member_id.message}
                </p>
              )}
              {memberDetails?.message && (
                <p className="text-green-500 text-sm flex items-center gap-2">
                  {memberDetails?.message} <MdVerified />
                </p>
              )}
              {!errors.member_id && memberError && (
                <p className="text-red-500 text-sm">{memberError}</p>
              )}
              {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="member_name"
                className="block text-lg font-medium text-gray-700"
              >
                Member Name
              </label>
              <input
                id="member_name"
                type="text"
                disabled={true}
                placeholder="Enter Member Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("member_name", {
                  required: "Invalid member ID. Please check and try again.",
                })}
              />
              {errors.member_name && (
                <p className="text-red-500 text-sm">
                  {errors.member_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-lg font-medium text-gray-700"
              >
                New Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter new category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("category", {
                  required: "Category name is required",
                })}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              {...register("description")}
            />
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-red-500 focus:outline-none focus:ring-0 sm:text-sm"
              onClick={handleCloseModal}
            >
              Discard
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-0 sm:text-sm"
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
