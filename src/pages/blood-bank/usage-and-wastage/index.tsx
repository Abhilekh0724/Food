import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { BloodUsage } from "@/lib/types";
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice";
import { dispatch, useSelector } from "@/store/store";
import { formatFilters } from "@/util/query-builder";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { columns } from "./components/columns";
import { UsageWastageStats } from "./components/usage-and-wastage-stats";
import UsageAndWastageTable from "./components/usage-and-wastage-table";

// Add type for the status filter
type StatusFilter = "all" | "unused" | "used" | "wasted" | "transferred";

export default function UsagePage() {
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState<string>("");
  const debouncedValue = useDebounce(search, 1000);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all"); // Add status filter state

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const stocks = useSelector((state) => state.bloodPouch.data);
  const fetchLoading = useSelector((state) => state.bloodPouch.fetchLoading);

  // Effect to handle filter changes
  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);

    // Build status filter based on the selected tab
    let statusFilterCondition = {};
    if (statusFilter !== "all") {
      if (statusFilter === "unused") {
        statusFilterCondition = {
          isUsed: false,
          expiry: {
            $gt: new Date(),
          },
        };
      } else if (statusFilter === "used") {
        statusFilterCondition = { isUsed: true };
      } else if (statusFilter === "wasted") {
        statusFilterCondition = {
          expiry: {
            $lt: new Date(),
          },
        };
      } else if (statusFilter === "transferred") {
        statusFilterCondition = {
          bloodPouchRequests: {
            requestType: "Transfer",
            status: "Approve",
          },
        };
      }
    }

    dispatch(
      fetchBloodPouches({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: "donor.donorProfile, bloodGroup",
          filters: {
            ...formattedFilters.filter,
            ...statusFilterCondition,
            organizer: {
              id: user?.organizerProfile?.id,
            },
            ...(debouncedValue !== "" && {
              $or: [
                {
                  donor: {
                    donorProfile: {
                      donorId: {
                        $containsi: debouncedValue,
                      },
                    },
                  },
                },
                {
                  pouchId: {
                    $containsi: debouncedValue,
                  },
                },
              ],
            }),
          },
          ...(sorting?.[0]?.id
            ? {
                sort: [
                  `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "desc" : "asc"}`,
                ],
              }
            : {}),
        },
      })
    );
  }, [
    columnFilters,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    user?.organizerProfile?.id,
    debouncedValue,
    statusFilter, // Add statusFilter to dependencies
  ]);

  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (stocks?.data?.map((d) => ({
      id: d.id,
      expiryDate: moment(d?.attributes?.expiry).format("DD MMM, YYYY"),
      donationDate: moment(d?.attributes?.donationDate).format("DD MMM, YYYY"),
      usedAt: d?.attributes?.usedAt
        ? moment(d?.attributes?.usedAt).format("DD MMM, YYYY")
        : "-",
      pouchId: d?.attributes?.pouchId,
      isUsed: d?.attributes?.isUsed,
      isWasted: d?.attributes?.isWasted,
      isTransferred: d?.attributes?.isTransferred,
      bloodType: d?.attributes?.bloodType,
      bloodGroup: d?.attributes?.bloodGroup?.data?.attributes?.name,
      status: d?.attributes?.isUsed
        ? "Used"
        : d?.attributes?.isWasted
        ? "Wasted"
        : d?.attributes?.isTransferred
        ? "Transferred"
        : "Available",
      donorId:
        d?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes
          ?.donorId,
      donor: d?.attributes?.donor?.data?.id,
      usageDate: moment(d?.attributes?.usedAt).format("DD MMM, YYYY"),
    })) ?? []) as BloodUsage[];
  }, [stocks]);

  const table = useReactTable<BloodUsage>({
    data: filteredData,
    manualPagination: true,
    pageCount: Math.ceil(filteredData?.length),
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const breadcrumbItems = [
    { label: "Usage and wastage", href: "/usage-and-wastage" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="mb-6">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>
      <div className="flex items-start justify-between gap-10">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Usage & Wastage Records
            </h2>
            <span className="text-sm">
              Track how blood units are used or wasted
              <br /> Total records :{filteredData?.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search stocks by pouchID and donorID ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <UsageWastageStats />
      </div>

      {/* Add Tabs component */}
      <div className="flex justify-between items-center">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          className="w-fit"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unused">Unused</TabsTrigger>
            <TabsTrigger value="used">Used</TabsTrigger>
            <TabsTrigger value="wasted">Wasted</TabsTrigger>
            <TabsTrigger value="transferred">Transferred</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <UsageAndWastageTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
