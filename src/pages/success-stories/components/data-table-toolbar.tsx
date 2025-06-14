import { Button } from "@/components/ui/button";
import { fetchCourses } from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  useEffect(() => {
    dispatch(fetchCourses({}));
  }, []);

  const courses = useSelector((state) => state.course.data?.data || []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex gap-x-2">
          {table.getColumn("course") && (
            <DataTableFacetedFilter
              column={table.getColumn("course")}
              title="Course"
              options={courses?.map((c) => ({
                label: c?.name,
                value: c?.id,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
