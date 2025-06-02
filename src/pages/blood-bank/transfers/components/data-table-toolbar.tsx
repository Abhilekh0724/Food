import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useSelector } from "@/store/store";
import { exportToCsv, printPDF } from "@/util/exports-util";
import { Table } from "@tanstack/react-table";
import { Download, Printer, X } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const bloodGroups = useSelector((state) => state.common.bloodGroups);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex gap-x-2">
          {table.getColumn("requestedBloodPouches.bloodType") && (
            <DataTableFacetedFilter
              column={table.getColumn("requestedBloodPouches.bloodType")}
              title="Blood Type"
              options={[{
                value: "Pasma",
                label: "Plasma",
              },
              {
                value: "Whole Blood",
                label: "Whole Blood",
              },
              {
                value: "Power Blood",
                label: "Power Blood",
              },
              ]}
            />
          )}



          {table.getColumn("requestedBloodPouches.bloodGroup.id") && (
            <DataTableFacetedFilter
              column={table.getColumn("requestedBloodPouches.bloodGroup.id")}
              title="Blood Group"
              options={bloodGroups}
            />
          )}

          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={[{
                value: "Pending",
                label: "Pending",
              },
              {
                value: "Reject",
                label: "Rejected",
              },
              {
                value: "Approve",
                label: "Approved",
              },

              {
                value: "Transfer",
                label: "Transferred",
              },
              {
                value: "Complete",
                label: "Completed",
              },
              {
                value: "Cancel",
                label: "Cancelled",
              },
              ]}
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
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => printPDF(table.getFilteredRowModel().rows, "Blood_Transfers")}
          className="h-8"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCsv(table.getFilteredRowModel().rows, "Blood_Transfers")}
          className="h-8"
        >
          <Download className="mr-2 h-4 w-4" />
          CSV
        </Button>
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
