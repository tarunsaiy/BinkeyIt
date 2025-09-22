import React, { use, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SummaryApi from "../common/summaryApi";
import Axios from "../utils/axios";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/login");
    }

    if (location?.state?.email) {
      setData((prev) => ({
        ...prev,
        email: location?.state?.email,
      }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.reset_password,
        data : data
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          email: "",
          newPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const validValue = Object.values(data).every((value) => value);
  return (
  <section className="w-full container mx-auto px-2 mt-12">
        <div className="my-4 bg-white w-full max-w-lg mx-auto rounded p-7">
          <p className="text-2xl font-bold text-center mb-4 text-green-800">Enter your new password</p>
  
          <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
            
  
            <div className="grid gap-1">
              <label htmlFor="newPassword">New Password</label>
              <div className="bg-blue-50 p-2 outline outline-transparent rounded flex items-center focus-within:outline-amber-300">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="h-full outline-none flex-1"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new assword"
                />
                <div
                  className="cursor-pointer ml-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
  
            <div className="grid gap-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="bg-blue-50 p-2 outline outline-transparent rounded flex items-center focus-within:outline-amber-300">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="h-full outline-none flex-1 border-amber-300"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                <div
                  className="cursor-pointer ml-2"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
  
            <button
              disabled={!validValue}
              className={` ${
                validValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-600"
              } text-white py-2 rounded mt-4 font-bold cursor-pointer`}
            >
              Change Password
            </button>
          </form>
  
          <p className="text-center mt-4">Already have an account ? 
            <Link to = {"/login"} className='font-bold text-green-700 hover:text-green-600'>Login</Link>
          </p>
        </div>
      </section>
  );
};

export default ResetPassword;
