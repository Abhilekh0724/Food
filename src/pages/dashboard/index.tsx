import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboardStats } from "@/store/features/dashboard-slice";
import { dispatch, useSelector } from "@/store/store";
import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Contact2Icon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  const [open, setOpen] = useState(false);

  // Generate years from 2000 to 2100
  const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

  const stats = useSelector((state) => state.dashboard.stats);

  useEffect(() => {
    // dispatch(
    //   getDashboardStats({
    //     params: {
    //       year: date.getFullYear(),
    //     },
    //   })
    // );
  }, [date]);

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            {/* <CalendarDateRangePicker /> */}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex-1">
                Staffs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parseFloat(stats?.totalRevenue).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex-1">
                Donors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.allEnrollmentsCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex-1">
                Blood Requests
              </CardTitle>
              <Contact2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.ongoingEnrollmentsCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <div className="flex items-center mb-10 justify-between pr-4">
              <CardHeader>
                <CardTitle>Monthwise blood requests of a year</CardTitle>
              </CardHeader>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy") : "Select a year"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Select
                    value={date ? date.getFullYear().toString() : undefined}
                    onValueChange={(value) => {
                      const year = parseInt(value);
                      setDate(new Date(year, 0, 1)); // Set to Jan 1st of the selected year
                      setOpen(false); // Close popover after selection
                    }}
                  >
                    <SelectTrigger className="border-0 shadow-none">
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            </div>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Blood Requests</CardTitle>
              <CardDescription>
                <Link to={"/enquiry"}>View All</Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
