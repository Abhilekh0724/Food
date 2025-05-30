import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { fetchCourses } from "@/store/features/course-slice";
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
import { columns, Course } from "./components/columns";
import CoursesTable from "./components/courses-table";

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.course.data);
  const fetchLoading = useSelector(
    (state: RootState) => state.course.fetchLoading
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
      fetchCourses({
        params: {
          populate: "image,category,level",
          pageSize: pagination.pageSize,
          page: pagination.pageIndex + 1,
          filters: {
            ...formattedFilters.filter,
            ...(debouncedValue !== ""
              ? {
                $or: [
                  {
                    name: {
                      $like: debouncedValue,
                    },
                  },
                ],
              }
              : {}),
          },
          ...(sorting?.[0]?.id
            ? {
              sort: `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "DESC" : "ASC"
                }`,
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
    user?.id,
    debouncedValue,
  ]);

  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (data?.data ?? []) as Course[];
  }, [data]);

  const table = useReactTable<Course>({
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
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <span className="text-sm">
            Total records : {data?.meta?.pagination?.total}
          </span>
        </div>{" "}
        <div className="flex items-center space-x-2 w-full">
          <Input
            placeholder="Search courses by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
          <Button onClick={() => navigate("/courses/add")}>Add Course</Button>
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <CoursesTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
