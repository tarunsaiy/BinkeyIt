import React from "react";
import logo from "../assets/Binkeyit Full Stack Ecommerce/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { useEffect } from "react";
const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const redirectLoginPage = () => {
    navigate("/login");
  };
  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  }
  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user")
  }
  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 flex items-center flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-around">
          {/* Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={140}
                height={50}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={50}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          <div className="hidden lg:block">
            <Search />
          </div>

          <div className="">
            {/* user icon only i mobile*/}
            <button onClick = {handleMobileUser} className="text-neutral-600 lg:hidden hover:cursor-pointer">
              <FaRegCircleUser size={26} />
            </button>

            {/*desktop*/}

            {/* only on website */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex  select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {
                      openUserMenu ? (
                        <GoTriangleUp size={20} />
                      ) : (
                        <GoTriangleDown size={20} />
                      )
                    }
                  </div>
                  {
                    openUserMenu && (
                      <div className="absolute right-0 top-14">
                        <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                          <UserMenu close = {handleCloseUserMenu}/>
                        </div>
                      </div>
                    )
                  }

                </div>
              ) : (
                <button
                  onClick={redirectLoginPage}
                  className="font-semibold h-[40px] px-5 cursor-pointer text-red-50  rounded bg-red-600 hover:bg-red-700"
                >
                  Login
                </button>
              )}
              <button className="flex h-[40px] items-center font-semibold gap-1.5 bg-red-600 px-4 py-3 rounded text-red-50 hover:bg-red-700">
                {/* add to cart */}
                <div className="animate-pulse">
                  <FaCartShopping size={20} />
                </div>
                <div className="bold">
                  <p>My cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
