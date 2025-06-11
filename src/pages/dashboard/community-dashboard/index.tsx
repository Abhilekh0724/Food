import { BloodNeedOverview } from "@/components/dashboard/blood-need-overview";
import { DonorRegistrationOverview } from "@/components/dashboard/donor-registration-overview";
import { EventOverview } from "@/components/dashboard/events-overview";
import { RecentBloodRequests } from "@/components/dashboard/recent-blood-requests";
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
import { useAuth } from "@/context/auth-context";
import { getCommunityDashboardStats } from "@/store/features/dashboard-slice";
import { dispatch, useSelector } from "@/store/store";
import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Contact2Icon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CommunityDashboardPage() {
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [date, setDate] = useState<Date>(new Date());
  const [donorDate, setDonorDate] = useState<Date>(new Date());
  const [needDate, setNeedDate] = useState<Date>(new Date());

  const [open, setOpen] = useState(false);

  // Generate years from 2000 to 2100
  const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

  const stats = useSelector((state) => state.dashboard.stats);

  useEffect(() => {
    dispatch(
      getCommunityDashboardStats({
        user,
        year: date.getFullYear(),
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to={"/community/donors"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex-1">
                  Donors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.donorsCount}</div>
              </CardContent>
            </Card>
          </Link>

          <Link to={"/community/blood-needs"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex-1">
                  Blood Needs
                </CardTitle>
                <Contact2Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.brCount}</div>
              </CardContent>
            </Card>
          </Link>

          <Link to={"/community/events"}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex-1">
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {parseFloat(stats?.eventsCount).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 flex flex-col gap-4">
            <Card
              style={{
                height: "fit-content",
              }}
            >
              <div className="flex items-center mb-10 justify-between pr-4">
                <CardHeader>
                  <CardTitle>Monthwise blood needs</CardTitle>
                  <CardDescription>
                    insside your working districts
                  </CardDescription>
                </CardHeader>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {needDate ? format(needDate, "yyyy") : "Select a year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Select
                      value={
                        needDate ? needDate.getFullYear().toString() : undefined
                      }
                      onValueChange={(value) => {
                        const year = parseInt(value);
                        setNeedDate(new Date(year, 0, 1)); // Set to Jan 1st of the selected year
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
                <BloodNeedOverview date={needDate} />
              </CardContent>
            </Card>

            <Card
              className="col-span-4"
              style={{
                height: "fit-content",
              }}
            >
              <div className="flex items-center mb-10 justify-between pr-4">
                <CardHeader>
                  <CardTitle>Monthwise donor registration</CardTitle>
                </CardHeader>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {donorDate ? format(donorDate, "yyyy") : "Select a year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Select
                      value={
                        donorDate
                          ? donorDate.getFullYear().toString()
                          : undefined
                      }
                      onValueChange={(value) => {
                        const year = parseInt(value);
                        setDonorDate(new Date(year, 0, 1)); // Set to Jan 1st of the selected year
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
                <DonorRegistrationOverview date={donorDate} />
              </CardContent>
            </Card>

            <Card
              className="col-span-4"
              style={{
                height: "fit-content",
              }}
            >
              <div className="flex items-center mb-10 justify-between pr-4">
                <CardHeader>
                  <CardTitle>Monthwise events</CardTitle>
                </CardHeader>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "yyyy") : "Select a year"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Select
                      value={
                        eventDate
                          ? eventDate.getFullYear().toString()
                          : undefined
                      }
                      onValueChange={(value) => {
                        const year = parseInt(value);
                        setEventDate(new Date(year, 0, 1)); // Set to Jan 1st of the selected year
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
                <EventOverview date={eventDate} />
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  Recent Blood Needs
                  <CardDescription className="font-normal">
                    insside your working districts
                  </CardDescription>
                </div>

                <Link className="text-sm text-primary" to={"/community/blood-needs"}>
                  View All
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentBloodRequests />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
