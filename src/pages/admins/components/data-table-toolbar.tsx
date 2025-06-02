import { Button } from "@/components/ui/button";
import { exportToCsv, printPDF } from "@/util/exports-util";
import { Table } from "@tanstack/react-table";
import { X, Download, Printer } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const data = table.getFilteredRowModel().rows.map(row => row.original);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex gap-x-2">
          {/* Your existing filters */}
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
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => printPDF(table.getFilteredRowModel().rows, "Admins")}
          className="h-8"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCsv(table.getFilteredRowModel().rows, "Admin")}
          className="h-8"
        >
          <Download className="mr-2 h-4 w-4" />
          CSV
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
