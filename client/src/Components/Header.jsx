import React from "react";
import logo from "../assets/Binkeyit Full Stack Ecommerce/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { useEffect } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import CartDisplay from "./CartDisplay";
const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cartItem = useSelector((state) => state.cartItem.cart)
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [openCartSection,setOpenCartSection] = useState(false)
  const redirectLoginPage = () => {
    navigate("/login");
  };
 
  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  }
 
  useEffect(() => {
    const totalQty = cartItem?.reduce((prev, curr) => prev + curr.quantity, 0);
    setTotalQuantity(totalQty);
  }, [cartItem])

  return (
    <header className="h-28 lg:h-20 lg:shadow-md sticky top-0 flex items-center flex-col justify-center gap-4 bg-white z-50">
      <div className="container mx-auto flex items-center px-2 justify-around">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between sm-justify-around">
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

          <div className="flex justify-around">

            <div className="flex relative items-center gap-2">
              {user?._id ? (
                <div className="block">
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
                          <UserMenu close={handleCloseUserMenu} />
                        </div>
                      </div>
                    )
                  }

                </div>
              ) : (
                <button
                  onClick={redirectLoginPage}
                  className="font-semibold h-[40px] px-5 cursor-pointer   rounded bg-amber-400 text-black w-20"
                >
                  Login
                </button>
              )}
              <button onClick={()=>setOpenCartSection(true)} className="flex w-fit items-center font-semibold justify-center bg-green-700 px-2 py-1 lg:py-2 rounded text-red-50 h-[40px] gap-2">
                {/* add to cart */}
                <div>
                  <FaCartShopping size={20} />
                </div>
                <div className="bold">
                  {
                    cartItem.length > 0 ? (
                      <div>
                        <p>{totalQuantity}</p>
                        {/* <p>{DisplayPriceInRupees(totalPrice)}</p> */}
                      </div>
                    ) : (

                      <></>
                    )
                  }
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      <div className=" container mx-auto px-2 lg:hidden">
        <Search />
      </div>
      {
            openCartSection && (
                <CartDisplay close={()=>setOpenCartSection(false)}/>
            )
        }
      
    </header>
  );
};

export default Header;
