import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { fetchActivities } from "@/store/features/activity-slice";
import { RootState } from "@/store/root-reducer";
import { AppDispatch } from "@/store/store";
import { devLog } from "@/util/logger";
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
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ActivityTable from "./components/activity-table";
import { Activity, columns } from "./components/columns";

export default function ActivityPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const data = useSelector((state: RootState) => state.activity.data);

  const fetchLoading = useSelector(
    (state: RootState) => state.activity.fetchLoading
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
    // You can use formattedFilters here to make API calls

    dispatch(
      fetchActivities({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: "actionBy",
          ...(debouncedValue !== ""
            ? {
              filters: {
                $or: [
                  {
                    followedBy: {
                      username: {
                        $contains: debouncedValue,
                      },
                    },
                  },
                  {
                    followedBy: {
                      phone: {
                        $contains: debouncedValue,
                      },
                    },
                  },
                ],
              },
            }
            : {}),
          ...(sorting?.[0]?.id
            ? {
              sort: [
                `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "desc" : "asc"}`,
              ],
            }
            : {
              sort: [
                'createdAt:desc',
              ],
            }),
        },
      })
    );
  }, [
    columnFilters,
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    user?.id,
    debouncedValue,
  ]);

  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (data?.data?.map((d) => ({
      id: d?.attributes?.actionBy?.data?.id,
      username: d?.attributes?.actionBy?.data?.attributes?.username,
      email: d?.attributes?.actionBy?.data?.attributes?.email,
      phone: d?.attributes?.actionBy?.data?.attributes?.phone,
      action: d?.attributes?.action,
      description: d?.attributes?.description,
      modelName: d?.attributes?.modelName,
      createdAt: moment(d?.attributes?.createdAt).format("DD MMM YYYY | HH:mm A"),
    })) ?? []) as Activity[];
  }, [data]);

  devLog(filteredData, "filtered dataaa");

  const table = useReactTable<Activity>({
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

  const breadcrumbItems = [{ label: "Activities", href: "/activities" }];

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
            <h2 className="text-3xl font-bold tracking-tight">Activities</h2>
            <span className="text-sm">
              Total records : {data?.meta?.pagination?.total}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search activities by phone or username ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <ActivityTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
