import React from "react";
import UserMenu from "../Components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector(state => state.user); // give all the data from userSlice
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px_1fr]">
        {/* left for menu */}
        <div className="py-4 top-24 hidden lg:block border-r border-slate-300">
          <UserMenu />
        </div>
        {/* right for content */}
        <div className="bg-white min-h-[75vh] pl-5">
            <Outlet/>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
