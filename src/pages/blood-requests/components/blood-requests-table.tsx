import Pagination from "@/components/common/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BloodRequest } from "@/lib/types";
import { useSelector } from "@/store/store";
import {
  flexRender,
  PaginationState,
  Table as TableProp,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { columns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";

interface BloodRequestTableProps {
  pagination: PaginationState;
  table: TableProp<BloodRequest>;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}
const BloodRequestTable = ({
  pagination,
  table,
  setPagination,
}: BloodRequestTableProps) => {
  const data = useSelector((state) => state.bloodRequest.data);

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
      {table.getRowModel().rows?.length ? (
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
      ) : null}
    </>
  );
};

export default BloodRequestTable;
