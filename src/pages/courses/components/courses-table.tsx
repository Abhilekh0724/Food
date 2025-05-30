import Pagination from "@/components/common/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "@/store/store";
import {
  flexRender,
  PaginationState,
  Table as TableProp,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { columns, Course } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

interface CoursesTableProps {
  pagination: PaginationState;
  table: TableProp<Course>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}
const CoursesTable = ({
  pagination,
  table,
  setPagination,
}: CoursesTableProps) => {
  const data = useSelector((state) => state.course.data);

  return (
    <>
      <div className="space-y-2">
        <DataTableToolbar table={table} />

        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        pagination={pagination}
        setPagination={setPagination}
        data={{
          data: data?.data ?? [],
          meta: data?.meta ?? {
            pagination: {
              pageCount: 0,
              total: 0,
              pageSize: 10,
              currentPage: 1,
              nextPage: null,
              prevPage: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }}
      />
    </>
  );
};

export default CoursesTable;
