import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { BloodRequest } from "@/lib/types";
import { fetchBloodRequests } from "@/store/features/blood-request-slice";
import { RootState } from "@/store/root-reducer";
import { AppDispatch } from "@/store/store";
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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import BloodRequestTable from "./components/blood-requests-table";
import { columns } from "./components/columns";

export default function BloodRequestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.bloodRequest.data);
  const fetchLoading = useSelector(
    (state: RootState) => state.bloodRequest.fetchLoading
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState<string>("");
  const debouncedValue = useDebounce(search, 3000);

  // Effect to handle filter changes
  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);
    // You can use formattedFilters here to make API calls

    dispatch(
      fetchBloodRequests({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: "requestedBy,requestedBloodGroup",
          filters: {
            district: {
              $in: user?.organizerProfile?.workingDistricts
                ?.split(",")
                ?.map((district) => district),
            },
            ...formattedFilters.filter,
            ...(debouncedValue !== "" && {
              $or: [
                {
                  patientName: {
                    $containsi: debouncedValue,
                  },
                },
                {
                  bloodRequestId: {
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
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    debouncedValue,
    user?.organizerProfile?.workingDistricts,
  ]);

  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (data?.data ?? []) as BloodRequest[];
  }, [data]);

  const table = useReactTable<BloodRequest>({
    data: filteredData,
    manualPagination: true,
    pageCount: Math.ceil(data?.meta?.pagination?.total || 0),
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
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
    { label: "Blood Requests", href: "/blood-requests" },
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
              Blood Requests
            </h2>
            <span className="text-sm">
              Total records : {data?.meta?.pagination?.total} (blood requests
              from your working districts)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search requests by request ID or patient's name ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <BloodRequestTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
