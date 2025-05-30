import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Activity = {
  id: string;
  createdAt: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  action: string;
  description: string;
  modelName: string;
};

const ActionsCell = ({ activity }: { activity: Activity }) => {
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
        <DropdownMenuItem onClick={() => navigate(`/users/${activity?.id}`)}>
          view
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "action",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Action
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
  },

  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Action By
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("description")}</div>;
    },
  },

  {
    id: 'createdAt',
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Action Date" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.createdAt}</div>;
    },
  },
];
