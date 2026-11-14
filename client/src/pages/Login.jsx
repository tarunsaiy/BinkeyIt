import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Store/userSlice";
import logo from "../assets/Binkeyit Full Stack Ecommerce/logo.png";

const Login = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setData((prev) => ({ ...prev, password: "" }));
      return;
    }
    navigate("/");
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!data.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.login,
        data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("access_token", response.data.data.accessToken);
        localStorage.setItem("refresh_token", response.data.data.refreshToken);
        setData({ email: "", password: "" });
        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const canContinue = data.email.trim().length > 0;
  const canLogin = data.password.trim().length > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close login"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={() => navigate("/")}
      />

      <div className="relative w-full max-w-[420px] rounded-2xl bg-white shadow-2xl px-6 py-8 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-5 top-5 text-gray-800 hover:text-gray-600 cursor-pointer"
          aria-label="Go back"
        >
          <IoArrowBack size={22} />
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#f8cb46]">
            <img src={logo} alt="Binkeyit" className="h-8 w-auto object-contain brightness-0" />
          </div>

          <h1 className="mb-1 font-bold text-gray-900">India&apos;s last minute app</h1>
          <p className="mb-8 font-medium text-gray-500">Log in or Sign up</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleContinue}>
            <div className="mb-4 flex items-center overflow-hidden rounded-xl border border-gray-300 focus-within:border-gray-400">
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-4 py-3.5 outline-none placeholder:text-gray-400"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!canContinue}
              className={`w-full rounded-xl py-3.5 font-bold text-white transition-colors ${
                canContinue
                  ? "cursor-pointer bg-[#0c831f] hover:bg-[#0a6b19]"
                  : "cursor-not-allowed bg-[#b8b8b8]"
              }`}
            >
              Continue
            </button>

            <p className="mt-4 text-center text-gray-500">
              New to Binkeyit?{" "}
              <Link to="/register" className="font-semibold text-[#0c831f] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mb-3 text-center text-gray-500">{data.email}</p>

            <div className="mb-2 flex items-center overflow-hidden rounded-xl border border-gray-300 focus-within:border-gray-400">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3.5 outline-none placeholder:text-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-4 text-gray-500 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            <div className="mb-4 text-right">
              <Link
                to="/forgot-password"
                className="font-medium text-[#0c831f] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!canLogin || loading}
              className={`w-full rounded-xl py-3.5 font-bold text-white transition-colors ${
                canLogin && !loading
                  ? "cursor-pointer bg-[#0c831f] hover:bg-[#0a6b19]"
                  : "cursor-not-allowed bg-[#b8b8b8]"
              }`}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center leading-relaxed text-gray-400">
          By continuing, you agree to our{" "}
          <Link to="#" className="underline hover:text-gray-600">
            Terms of service
          </Link>{" "}
          &{" "}
          <Link to="#" className="underline hover:text-gray-600">
            Privacy policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
