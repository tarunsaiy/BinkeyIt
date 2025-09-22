import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [isSearchPage, setIsSearchPage] = useState(false);

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border border-gray-300 overflow-hidden flex items-center text-neutral-500 bg-gray-100 group focus-within:border-amber-400">
      {isMobile && isSearchPage ? (
        <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-amber-400 bg-white ">
          <FaArrowLeft size={20} />
        </Link>
      ) : (
        <button className="flex justify-center items-center h-full p-3 group-focus-within:text-amber-400">
          <IoSearch size={22} />
        </button>
      )}

      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                ,
                1000,
                'Search "bread"',
                ,
                1000,
                'Search "sugar"',
                ,
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                ,
                1000,
                'Search "curd"',
                ,
                1000,
                'Search "rice"',
                ,
                1000,
                'Search "egg"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="search for the items"
              className="bg-transparent h-full w-full outline-none"
              autoFocus="true"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
