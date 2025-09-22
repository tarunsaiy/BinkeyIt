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
const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const validValue = Object.values(data).every((value) => value); //identify if all fields are filled

  return (
    <section className="w-full container mx-auto px-2 mt-12">
      <div className="my-4 bg-white w-full max-w-lg mx-auto rounded p-7">
        <p className="text-2xl font-bold text-center mb-4 text-green-800">Welcome to Binkeyit</p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1 ">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-blue-50 p-2 outline outline-transparent focus-within:outline-amber-300"
              value={data.name}
              onChange={handleChange}
              name="name"
              placeholder="Enter your name"
            />
          </div>

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

          <div className="grid gap-1">
            <label htmlFor="password">Password</label>
            <div className="bg-blue-50 p-2 outline outline-transparent rounded flex items-center focus-within:outline-amber-300">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="h-full outline-none flex-1"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
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
            Register
          </button>
        </form>

        <p className="text-center mt-4">Already have an account ? 
          <Link to = {"/login"} className='font-bold text-green-700 hover:text-green-600'>Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
