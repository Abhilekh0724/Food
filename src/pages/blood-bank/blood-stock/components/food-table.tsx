import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FoodItem } from "@/lib/types";
import {
  flexRender,
  PaginationState,
  Table as TableProp,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { foodColumns } from "./food-columns";
import { DataTableToolbar } from "./data-table-toolbar";
import Pagination from "@/components/common/pagination";

interface FoodTableProps {
  pagination: PaginationState;
  table: TableProp<FoodItem>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  data: FoodItem[];
}

const FoodTable = ({
  pagination,
  table,
  setPagination,
  data,
}: FoodTableProps) => {
  return (
    <>
      <div className="space-y-2">
        <DataTableToolbar table={table} />

        <div className="rounded-md border">
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
                    colSpan={foodColumns.length}
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
      {table.getRowModel().rows?.length ? (
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          data={{
            data: data,
            meta: {
              pagination: {
                pageCount: Math.ceil(data.length / pagination.pageSize),
                total: data.length,
                pageSize: pagination.pageSize,
                currentPage: pagination.pageIndex + 1,
                nextPage: pagination.pageIndex + 1 < Math.ceil(data.length / pagination.pageSize) ? pagination.pageIndex + 2 : null,
                prevPage: pagination.pageIndex > 0 ? pagination.pageIndex : null,
                hasNextPage: pagination.pageIndex + 1 < Math.ceil(data.length / pagination.pageSize),
                hasPreviousPage: pagination.pageIndex > 0,
              },
            },
          }}
        />
      ) : null}
    </>
  );
};

export default FoodTable; 