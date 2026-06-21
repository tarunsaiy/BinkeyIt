import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Axios from "../utils/axios";
import SummaryApi from "../common/summaryApi";
import { logout } from "../Store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin.js";
import {
  dashboardMenuLinkClass,
  dashboardMenuMetaClass,
  dashboardMenuTitleClass,
} from "../utils/dashboardStyles";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

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
  };

  const isActive = (path) => {
    if (path === "/dashboard/myorders") {
      return location.pathname.startsWith("/dashboard/myorders");
    }
    return location.pathname === path;
  };

  const formatMobile = (mobile) => {
    if (!mobile) return "";
    return String(mobile).trim().replace(/^\+/, "");
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 pb-2">
        <p className={dashboardMenuTitleClass}>My Account</p>
        {user?.mobile && (
          <p className={`mt-0.5 ${dashboardMenuMetaClass}`}>
            {formatMobile(user.mobile)}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <Link
          onClick={handleClose}
          to="/dashboard/myorders"
          className={dashboardMenuLinkClass(isActive("/dashboard/myorders"))}
        >
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className={dashboardMenuLinkClass(isActive("/dashboard/address"))}
        >
          Saved Addresses
        </Link>

        {isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/category"
              className={dashboardMenuLinkClass(isActive("/dashboard/category"))}
            >
              Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/subcategory"
              className={dashboardMenuLinkClass(isActive("/dashboard/subcategory"))}
            >
              SubCategory
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/upload-product"
              className={dashboardMenuLinkClass(isActive("/dashboard/upload-product"))}
            >
              Upload Product
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/product"
              className={dashboardMenuLinkClass(isActive("/dashboard/product"))}
            >
              Product
            </Link>
          </>
        )}

        <Link
          onClick={handleClose}
          to="/dashboard/profile"
          className={dashboardMenuLinkClass(isActive("/dashboard/profile"))}
        >
          Account Privacy
        </Link>

        <button
          onClick={handleLogout}
          className={`${dashboardMenuLinkClass(false)} w-full text-left`}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
