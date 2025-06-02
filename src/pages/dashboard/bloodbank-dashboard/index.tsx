import Loader from "@/components/common/loader";
import { BloodStockOverview } from "@/components/dashboard/blood-stock-overview";
import { RecentDonations } from "@/components/dashboard/recent-donations";
import { RecentTransfers } from "@/components/dashboard/recent-transfers";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { useAuth } from "@/context/auth-context";
import { getBloodBankDashboardStats } from "@/store/features/dashboard-slice";
import { dispatch, useSelector } from "@/store/store";
import { useEffect, useState } from "react";

export default function BloodBankDashboardPage() {
  const { user } = useAuth()

  const loading = useSelector(state => state.dashboard.isLoading)

  useEffect(() => {
    dispatch(
      getBloodBankDashboardStats({
        user
      })
    );
  }, [user]);

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {/* <CalendarDateRangePicker /> */}
          </div>
        </div>
        {loading ? <Loader /> : <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BloodStockOverview />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RecentDonations />
            </div>
            <div className="col-span-3">
              <StockAlerts />
            </div>
          </div>
          <div className="mt-4">
            <RecentTransfers />
          </div>
        </>}
      </div>
    </>
  );
}
