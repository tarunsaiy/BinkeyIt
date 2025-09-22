import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Register from "./Register";
import { IoMdSend } from "react-icons/io";
const ForgotPassword = () => {
  const [data, setData] = useState({
   
    email: "",
    
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
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
        ...SummaryApi.forgot_password,
        data : data
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", {
            state: data
  
        });
        setData({
          email: "",

        });
        
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const validValue = Object.values(data).every((value) => value); //identify if all fields are filled

  return (
    <section className="w-full container mx-auto px-2 mt-12">
      <div className="my-4 bg-white w-full max-w-lg mx-auto rounded p-7">
        <p className="text-2xl font-bold text-center mb-4">Enter your email address to reset password</p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          

          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="text"
              id="email"
              className="bg-blue-50 p-2 outline outline-transparent focus-within:outline-amber-300"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter valid email address"
            />
          </div>

          

          <button
            disabled={!validValue}
            className={` ${
              validValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-600"
            } text-white py-2 rounded mt-4 font-bold cursor-pointer flex items-center justify-center gap-1.5`}
          >
            Send Otp <IoMdSend size={20}/>
          </button>
        </form>

        <p className="text-center mt-4">Already have an account?
          <Link to = {"/login"} className='font-bold text-green-700 hover:text-green-600'>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
