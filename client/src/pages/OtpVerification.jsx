import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { useEffect } from "react";
const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([])
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
        navigate("/forgot-password");
      }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verify,
        data: {
          otp: data.join(""),
          email: location.state.email,
        },
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", { state: {
            data : response.data,
            email : location.state.email
        } 
    });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const validValue = data.every((value) => value); //identify if all fields are filled

  return (
    <section className="w-full container mx-auto px-2 mt-12">
      <div className="my-4 bg-white w-full max-w-lg mx-auto rounded p-7">
        <p className="text-2xl font-bold text-center mb-4">Enter Otp </p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Enter 6 digit OTP : </label>
            <div className="flex items-center gap-2 justify-between mt-6">
              {" "}
              {data.map((element, index) => (
                <input
                  key={"otp" + index}
                  type="text"
                  id="otp"
                  ref = {(ref) => {
                    inputRef.current[index] = ref;
                    return ref;
                  }}
                  value={data[index]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);
                    if (value && index < 5) {
                        inputRef.current[index+1].focus();
                    }
                  }}
                  maxLength={1}
                  
                  className="bg-blue-50 w-full h-[40px] text-center outline outline-transparent focus-within:outline-amber-300 font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            disabled={!validValue}
            className={` ${
              validValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-600"
            } text-white py-2 rounded mt-4 font-bold cursor-pointer flex items-center justify-center gap-1.5`}
          >
            Verify Otp
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?
          <Link
            to={"/login"}
            className="font-bold text-green-700 hover:text-green-600"
          ></Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
