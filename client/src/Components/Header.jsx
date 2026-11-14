import { useEffect, useState } from "react";
import logo from "../assets/Binkeyit Full Stack Ecommerce/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMobile from "../hooks/useMobile";
import useGeolocation from "../hooks/useGeolocation";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import CartDisplay from "./CartDisplay";
import { useGlobalContext } from "../Provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

const formatCartPrice = (price) =>
  DisplayPriceInRupees(price).replace(/\.00$/, "");

const LocationBlock = ({ address, loading, onRefresh, className = "" }) => (
  <button
    type="button"
    onClick={onRefresh}
    className={`flex flex-col items-start text-left min-w-0 cursor-pointer group ${className}`}
    title="Click to refresh location"
  >
    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
      Delivery in 10 minutes
    </p>
    <div className="flex items-center gap-0.5 text-xs text-gray-600 w-full max-w-[240px] lg:max-w-[280px]">
      <span className="truncate">
        {loading ? "Detecting location..." : address || "Enable location access"}
      </span>
      <GoTriangleDown size={14} className="shrink-0 text-gray-500" />
    </div>
  </button>
);

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isMobile] = useMobile();
  const routeLocation = useLocation();
  const isSearchPage = routeLocation.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openCartSection, setOpenCartSection] = useState(false);
  const { address, loading: locationLoading, refreshLocation } = useGeolocation();
  const { totalQuantity, totalPrice } = useGlobalContext();

  useEffect(() => {
    if (!totalQuantity) {
      setOpenCartSection(false);
    }
  }, [totalQuantity]);

  const handleOpenCart = () => {
    if (!totalQuantity) return;
    setOpenCartSection(true);
  };

  const renderAuthAction = (className = "") => {
    if (user?._id) {
      return (
        <div className={`relative ${className}`}>
          <button
            type="button"
            onClick={() => setOpenUserMenu((prev) => !prev)}
            className="flex items-center gap-0.5 cursor-pointer text-xs font-semibold text-gray-700"
          >
            <span>Account</span>
            {openUserMenu ? <GoTriangleUp size={12} /> : <GoTriangleDown size={12} />}
          </button>
          {openUserMenu && (
            <div className="absolute right-0 top-8 z-50">
              <div className="bg-white rounded-md py-2 min-w-[180px] shadow-lg border border-gray-100">
                <UserMenu close={() => setOpenUserMenu(false)} />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => navigate("/login")}
        className={`text-sm font-bold text-gray-800 hover:text-gray-600 cursor-pointer ${className}`}
      >
        Login
      </button>
    );
  };

  const renderCartButton = () => {
    if (!totalQuantity) {
      return (
        <button
          type="button"
          onClick={handleOpenCart}
          className="flex items-center gap-2 rounded-lg bg-[#e8e8e8] px-3 py-2 text-xs font-bold text-[#666666] cursor-default whitespace-nowrap"
          
        >
          <HiOutlineShoppingCart size={20} />
          <span>My Cart</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleOpenCart}
        className="flex items-center gap-2.5 rounded-lg bg-[#0C831F] px-3 py-2 cursor-pointer hover:bg-[#0a6b19] whitespace-nowrap"
      >
        <HiOutlineShoppingCart size={22} className="shrink-0 text-white" />
        <div className="flex flex-col items-start leading-tight text-white">
          <span className="text-sm font-bold">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          <span className="text-sm font-bold">{formatCartPrice(totalPrice)}</span>
        </div>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {!(isSearchPage && isMobile) && (
        <>
          <div className="container mx-auto">
            <div className="flex items-center gap-3 lg:gap-5 h-[68px] lg:h-[72px]">
              <Link to="/" className="shrink-0">
                <img
                  src={logo}
                  width={120}
                  height={44}
                  alt="logo"
                  className="w-[120px] lg:w-[140px] h-auto"
                />
              </Link>

              <div className="hidden sm:block w-px h-10 bg-gray-300 shrink-0" />

              <LocationBlock
                address={address}
                loading={locationLoading}
                onRefresh={refreshLocation}
                className="hidden sm:flex max-w-[280px]"
              />

              <div className="hidden lg:flex flex-1 max-w-2xl mx-2">
                <Search />
              </div>

              <div className="flex items-center gap-4 lg:gap-6 ml-auto shrink-0">
                {renderAuthAction("hidden lg:block")}
                {renderCartButton()}
              </div>
            </div>

            <div className="sm:hidden pb-2 flex items-center justify-between gap-3">
              <LocationBlock
                address={address}
                loading={locationLoading}
                onRefresh={refreshLocation}
                className="flex-1 min-w-0"
              />
              {renderAuthAction()}
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto pb-3 lg:hidden">
        <Search />
      </div>

      {openCartSection && totalQuantity > 0 && (
        <CartDisplay close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
