import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { genderOptions } from "@/data/gender";
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
  const { user } = useAuth();
  const isFiltered = table.getState().columnFilters.length > 0;
  const bloodGroups = useSelector((state) => state.common.bloodGroups);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="flex gap-x-2">
          {table.getColumn("patientGender") && (
            <DataTableFacetedFilter
              column={table.getColumn("patientGender")}
              title="Gender"
              options={genderOptions}
            />
          )}

          {table.getColumn("isFulFilled") && (
            <DataTableFacetedFilter
              column={table.getColumn("isFulFilled")}
              title="Fulfilled"
              options={[
                {
                  label: "Yes",
                  value: 1,
                },

                {
                  label: "No",
                  value: 0,
                },
              ]}
            />
          )}

          {table.getColumn("urgency") && (
            <DataTableFacetedFilter
              column={table.getColumn("urgency")}
              title="Urgency"
              options={[
                {
                  label: "Urgent",
                  value: "Urgent",
                },

                {
                  label: "Medium",
                  value: "Medium",
                },
              ]}
            />
          )}

          {table.getColumn("requestedBloodGroup.id") && (
            <DataTableFacetedFilter
              column={table.getColumn("requestedBloodGroup.id")}
              title="Blood Group"
              options={bloodGroups}
            />
          )}

          {table.getColumn("bloodType") && (
            <DataTableFacetedFilter
              column={table.getColumn("bloodType")}
              title="Blood Type"
              options={[
                {
                  label: "Plasma",
                  value: "Pasma",
                },

                {
                  label: "Whole Blood",
                  value: "Whole Blood",
                },

                {
                  label: "Power Blood",
                  value: "Power Blood",
                },
              ]}
            />
          )}

          {table.getColumn("district") && (
            <DataTableFacetedFilter
              column={table.getColumn("district")}
              title="District"
              options={
                user?.organizerProfile?.workingDistricts
                  ?.split(",")
                  ?.map((d) => ({
                    label: d,
                    value: d,
                  })) || []
              }
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
          onClick={() => printPDF(table.getFilteredRowModel().rows, "Blood_Requests")}
          className="h-8"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCsv(table.getFilteredRowModel().rows, "Blood_Requests")}
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
