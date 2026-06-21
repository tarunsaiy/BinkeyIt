import React from "react";
import UserMenu from "../Components/UserMenu";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="bg-[#F8F8F8]">
      <div className="container mx-auto py-4">
        <div className="flex h-[calc(100dvh-8rem)] min-h-[32rem] overflow-hidden rounded-lg border border-[#eeeeee] bg-white lg:h-[calc(100dvh-7rem)]">
          <aside className="hidden w-[260px] shrink-0 border-r border-[#eeeeee] bg-white lg:flex lg:flex-col lg:items-start lg:justify-start">
            <div className="w-full shrink-0 py-4">
              <UserMenu />
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="dashboard-outlet min-h-0 flex-1 overflow-y-auto thin-scrollbar px-4 py-5 sm:px-6 sm:py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
