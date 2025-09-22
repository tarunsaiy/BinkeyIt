import toast from "react-hot-toast";
const AxiosToastError = (error) => {
  const msg =
    error?.response?.data?.message || // backend message
    error?.message ||                 // generic error (e.g. network issues)
    "Something went wrong!";          // fallback
  toast.error(msg);
};

export default AxiosToastError;