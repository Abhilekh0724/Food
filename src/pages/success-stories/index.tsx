import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { fetchSuccessStories } from "@/store/features/success-stories-slice";
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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { columns, SuccessStory } from "./components/columns";
import SuccessStoryTable from "./components/success-story-table";

export default function SuccessStoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.successStory.data);
  const fetchLoading = useSelector(
    (state: RootState) => state.successStory.fetchLoading
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
  const debouncedValue = useDebounce(search, 1000);

  // Effect to handle filter changes
  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);

    // You can use formattedFilters here to make API calls

    dispatch(
      fetchSuccessStories({
        params: {
          populate: "image,course",
          pageSize: pagination.pageSize,
          page: pagination.pageIndex + 1,
          filters: {
            ...formattedFilters.filter,
            ...(debouncedValue !== ""
              ? {
                  $or: [
                    {
                      studentName: {
                        $like: debouncedValue,
                      },
                      "course.name": {
                        $like: debouncedValue,
                      },
                      company: {
                        $like: debouncedValue,
                      },
                      position: {
                        $like: debouncedValue,
                      },
                    },
                  ],
                }
              : {}),
          },
          ...(sorting?.[0]?.id
            ? {
                sort: [
                  `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "desc" : "asc"}`,
                ],
              }
            : {
                sort: ["createdAt:desc"],
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
    return (data?.data ?? []) as SuccessStory[];
  }, [data]);

  const table = useReactTable<SuccessStory>({
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Success Stories</h2>
          <span className="text-sm">
            Total records : {data?.meta?.pagination?.total}
          </span>
        </div>{" "}
        <div className="flex items-center space-x-2 w-full flex-1">
          <Input
            placeholder="Search stories by student name, course name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
          <Button onClick={() => navigate("/success-stories/add")}>
            Add Story
          </Button>
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <SuccessStoryTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
