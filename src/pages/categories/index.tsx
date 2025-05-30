import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { fetchCategories } from "@/store/features/category-slice";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./components/category-table";
import { Category, columns } from "./components/columns";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const data = useSelector((state) => state.category.data);
  const fetchLoading = useSelector((state) => state.category.fetchLoading);

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
      fetchCategories({
        params: {
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
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    debouncedValue,
  ]);

  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (data?.data ?? []) as Category[];
  }, [data]);

  const table = useReactTable<Category>({
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
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <span className="text-sm">
            Total records : {data?.meta?.pagination?.total}
          </span>
        </div>{" "}
        <div className="flex items-center space-x-2 w-full">
          <Input
            placeholder="Search categories by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
          />
          <Button onClick={() => navigate("/course-categories/add")}>
            Add Category
          </Button>
        </div>
      </div>

      {fetchLoading ? (
        <Loader />
      ) : (
        <CategoryTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}
