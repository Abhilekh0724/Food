import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useSelector } from "@/store/store";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
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
          {table.getColumn("bloodGroup") && (
            <DataTableFacetedFilter
              column={table.getColumn("bloodGroup")}
              title="Blood Group"
              options={bloodGroups}
            />
          )}
          {table.getColumn("bloodType") && (
            <DataTableFacetedFilter
              column={table.getColumn("bloodType")}
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
      <DataTableViewOptions table={table} />
    </div>
  );
}
