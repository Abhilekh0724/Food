import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { fetchFollowers } from "@/store/features/follower-slice";
import { RootState } from "@/store/root-reducer";
import { AppDispatch } from "@/store/store";
import { devLog } from "@/util/logger";
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
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { columns, Follower } from "./components/columns";
import FollowerTable from "./components/followers-table";

export default function FollowerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.follower.data);

  devLog(data, "datatataa");
  const fetchLoading = useSelector(
    (state: RootState) => state.follower.fetchLoading
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
      fetchFollowers({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: "followedBy",
          filters: {
            ...formattedFilters.filter,
            ...(debouncedValue !== "" && {
              $or: [
                {
                  followedBy: {
                    username: {
                      $containsi: debouncedValue,
                    },
                  },
                },
                {
                  followedBy: {
                    phone: {
                      $containsi: debouncedValue,
                    },
                  },
                },
              ],
            }),
          },
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
      id: d?.attributes?.followedBy?.data?.id,
      username: d?.attributes?.followedBy?.data?.attributes?.username,
      gender: d?.attributes?.followedBy?.data?.attributes?.gender,
      createdAt: moment(
        d?.attributes?.followedBy?.data?.attributes?.createdAt
      ).format("MMM DD, YYYY"),
    })) ?? []) as Follower[];
  }, [data]);

  const table = useReactTable<Follower>({
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

  const breadcrumbItems = [{ label: "Followers", href: "/followers" }];

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
            <h2 className="text-3xl font-bold tracking-tight">Followers</h2>
            <span className="text-sm">
              Total records : {data?.meta?.pagination?.total}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search followers by phone or username ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <FollowerTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
