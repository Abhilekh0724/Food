import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  });

  const handleSidebarChange = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem("sidebarOpen", JSON.stringify(open));
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <DashboardSidebar
          open={sidebarOpen}
          onOpenChange={handleSidebarChange}
        />
        <DashboardHeader />
        <main
          className={`flex-1 space-y-4 p-8 pt-6 duration-300 transition-all ${sidebarOpen ? "md:ml-[16rem]" : "ml-[4rem]"
            }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
