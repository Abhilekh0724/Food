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
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Admin = {
  id: string;
  createdAt: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
};

const ActionsCell = ({ admin }: { admin: Admin }) => {
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
        <DropdownMenuItem onClick={() => navigate(`/admins/${admin?.id}`)}>
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Admin>[] = [
  {
    id: "user.username",
    accessorKey: "Full Name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Full Name"
        className="font-bold"
      />
    ),
    cell: ({ row }) => (
      // <Link to={`/admins/${row.original.id}`}>{row.original.username}</Link>
      <span>
        {row.original.username}
      </span>
    ),
  },

  {
    accessorKey: "Email",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row.original.email}</div>,
  },

  {
    accessorKey: "Phone",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row.original.phone}</div>,
  },

  {
    id: "user.dob",
    accessorKey: "DOB",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Age"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => {
      return <div>{moment().diff(moment(row?.original?.dob), "years")} years</div>;
    },
  },

  {
    id: "user.gender",
    accessorKey: "Gender",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.gender}</div>;
    },
  },

  {
    id: "createdAt",
    accessorKey: "Joined Date",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Joined Date"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.createdAt}</div>;
    },
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="font-bold"
      />
    ),
    cell: ({ row }) => <ActionsCell admin={row.original} />,
  },
];
