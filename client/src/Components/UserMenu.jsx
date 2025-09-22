import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "./Divider";
import { Link } from "react-router-dom";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import { logout } from "../Store/userSlice";
import toast from "react-hot-toast";
import { HiOutlineExternalLink } from "react-icons/hi";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin.js";
const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        window.history.back();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const handleClose = () => {
    if (close) {
      close();
    }
  }
  return (
    <div>
      <div className="font-semibold">My account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}
          {
          (user.role === "ADMIN") && <span className=" text-xs font-semibold border bg-amber-100 text-amber-600 border-amber-400 rounded px-1  ml-1">"Admin"</span>
          }
        </span>
        <Link to={"/dashboard/profile"} onClick={handleClose} className="hover:text-green-800">
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>
      <Divider />


      <div className="text-sm grid gap-2">
        {
          
          isAdmin(user.role) && (
            <>
              <Link onClick={handleClose} to={"/dashboard/category"} className="px-2 hover:bg-amber-200 py-1">
                Category
              </Link>

              <Link onClick={handleClose} to={"/dashboard/subcategory"} className="px-2 hover:bg-amber-200 py-1">
                SubCategory
              </Link>
              <Link onClick={handleClose} to={"/dashboard/upload-product"} className="px-2 hover:bg-amber-200 py-1">
                Upload Product
              </Link>
              <Link onClick={handleClose} to={"/dashboard/product"} className="px-2 hover:bg-amber-200 py-1">
                Product
              </Link>
            </>
          )
        }


        <Link onClick={handleClose} to={"/dashboard/myorders"} className="px-2 hover:bg-amber-200 py-1">
          My Orders
        </Link>
        <Link onClick={handleClose} to={"/dashboard/address"} className="px-2 hover:bg-amber-200 py-1">
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="text-left px-2 hover:bg-amber-200 py-1"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
