import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { devLog } from "@/util/logger";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, FilterIcon, MoreHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Customer = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  gender: "male" | "female" | "other";
  lastOrder: string;
};

const ActionsCell = ({ customer }: { customer: Customer }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigate(`/customers/edit/${customer.id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            devLog("Delete customer:", customer.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterSelect = ({
  column,
  options,
}: {
  column: any;
  options: string[];
}) => {
  const selectedValues = (column.getFilterValue() as string[]) || [];

  const handleSelect = (value: string) => {
    const currentFilters = selectedValues;
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value)
      : [...currentFilters, value];

    column.setFilterValue(newFilters.length ? newFilters : undefined);
  };

  const handleReset = () => {
    column.setFilterValue(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <FilterIcon
            size={14}
            className={selectedValues.length ? "text-primary" : "text-gray-500"}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          Filter by
          {selectedValues.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={handleReset}
            >
              <X size={12} className="text-gray-500" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedValues.includes(option)}
            onCheckedChange={() => handleSelect(option)}
            className="capitalize"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>Status</span>
          <FilterSelect column={column} options={["active", "inactive"]} />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>Gender</span>
          <FilterSelect column={column} options={["male", "female", "other"]} />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("gender")}</div>
    ),
  },
  {
    accessorKey: "lastOrder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("lastOrder")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell customer={row.original} />,
  },
];
