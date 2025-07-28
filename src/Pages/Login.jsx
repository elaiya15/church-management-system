import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../App";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [Response, setResponse] = useState(false);
  const [ResponseMessage, setResponseMessage] = useState("");
  const [ResponseColor, setResponseColor] = useState("");




  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${URL}`, { timeout: 90000 });
        console.log(response.data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    fetchData();
  }, []);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);


   const handleDemo = async (event) => {
    event.preventDefault();
     alert("The backend is hosted on Render.com (free tier), so it may take up to 60 seconds to wake up. Please wait patiently while we log you in.");

    const data = {
      username: "Admin123",
      password: "Admin@123",
    };
    try {
      const response = await axios.post(`${URL}/login`, data);
      window.localStorage.setItem("token", response.data.token);
      setResponse(true);
      setResponseMessage("Login Successful.");
      setResponseColor("text-green-600");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      setResponse(true);
      setResponseColor("text-red-600");
      setResponseMessage("Login Failed!");
    } finally {
      setTimeout(() => {
        setResponse(false);
      }, 1000);
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    try {
      const response = await axios.post(`${URL}/login`, data);
      window.localStorage.setItem("token", response.data.token);
      setResponse(true);
      setResponseMessage("Login Successful.");
      setResponseColor("text-green-600");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      setResponse(true);
      setResponseColor("text-red-600");
      setResponseMessage("Login Failed!");
    } finally {
      setTimeout(() => {
        setResponse(false);
      }, 1000);
    }
  };
  return (
    <React.Fragment>
       {status === "success" && (
        <div className="fixed p-3 text-green-800 transition-opacity duration-300 bg-green-100 rounded-md shadow-md top-4 right-4">
          ✅  Server handshake successfully!
        </div>
      )}

      {status === "error" && (
        <div className="fixed p-3 text-red-800 transition-opacity duration-300 bg-red-100 rounded-md shadow-md top-4 right-4">
          ❌ Server handshake failed! Please try again.
        </div>
      )}
      <section className="bg-[url('./assets/login-bg-min.png')] bg-cover bg-center bg-no-repeat bg-lavender--600 w-screen h-screen flex-col flex items-center justify-center">
        <div className="w-full max-w-xs p-8 bg-white border border-gray-200 shadow 2xl:max-w-lg lg:max-w-sm xl:max-w-md lg:p-10 xl:p-12 rounded-3xl sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form
            className="space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12"
            onSubmit={handleSubmit}
          >
            <h5 className="text-xl font-bold text-center text-lavender--600 dark:text-white">
              LOG IN
            </h5>
            <div className="relative">
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-lavender--600 focus:outline-none focus:ring-0 focus:border-lavender--600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="username"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-lavender--600 peer-focus:dark:text-lavender--600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Username
              </label>
            </div>
            <div className="relative">
              <input
                type={PasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-lavender--600 focus:outline-none focus:ring-0 focus:border-lavender--600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-lavender--600 peer-focus:dark:text-lavender--600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Password
              </label>
              <div className="absolute inset-y-0 right-0 flex items-center pr-5 text-sm leading-5 ">
                {PasswordVisible ? (
                  <i
                    onClick={() => setPasswordVisible(false)}
                    className="fa-solid fa-eye text-lavender--600 hover:cursor-pointer"
                  ></i>
                ) : (
                  <i
                    onClick={() => setPasswordVisible(true)}
                    className="fa-solid fa-eye-slash text-lavender--600 hover:cursor-pointer"
                  ></i>
                )}
              </div>
            </div>
            <div className="my-5 text-center">
              {Response && (
                <p className={`${ResponseColor} font-semibold text-sm`}>
                  {ResponseMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full text-white bg-lavender--600 hover:bg-lavender--600 focus:ring-4 focus:outline-none focus:ring-lavender--600 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-lavender--600 dark:hover:bg-lavender--600 dark:focus:ring-lavender--600"
            >
              Login
            </button>
            
          </form>
           &nbsp;
           <button
             onClick={handleDemo}

                           className="w-full text-white bg-lavender--600 hover:bg-lavender--600 focus:ring-4 focus:outline-none focus:ring-lavender--600 font-medium rounded-lg text-base px-5 py-2.5 text-center dark:bg-lavender--600 dark:hover:bg-lavender--600 dark:focus:ring-lavender--600"
            >
              View Demo
            </button>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Login;
