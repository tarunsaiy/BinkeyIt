import React from "react";
import UserMenu from "../Components/UserMenu";
import { IoClose } from "react-icons/io5";
const UserMenuMobilePage = () => {
  
  return (
    <section className="bg-white h-full w-full py-8">
      <button onClick={()=> {window.history.back()}} className="text-neutral-800 block w-fit ml-auto hover:cursor-pointer">
        <IoClose size={25} />
      </button>
      <div className="container mx-auto px-3">
        <UserMenu />
      </div>
    </section>
  );
};

export default UserMenuMobilePage;
