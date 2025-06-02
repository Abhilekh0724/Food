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

export type Donor = {
  id: string;
  donorId: string;
  donor_id: string;
  createdAt: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
};

const ActionsCell = ({ donor }: { donor: Donor }) => {
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
        <DropdownMenuItem onClick={() => navigate(`/donors/edit/${donor?.donor_id}`)}>
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Donor>[] = [

  {
    id: "donor.donorId",
    accessorKey: "donorId",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="DonorID"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => (
      <Link to={`/donors/${row.original.id}`}>{row.original.donorId}</Link>
    ),
  },

  {
    id: "donor.username",
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Full Name"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => (
      <Link to={`/donors/${row.original.id}`}>{row.original.username}</Link>
    ),
  },

  {
    id: "donor.bloodGroup.id",
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Blood Group"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => (
      <div>{row.original.bloodGroup}</div>
    ),
  },

  {
    accessorKey: "email",
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
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },

  {
    accessorKey: "phone",
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
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },

  {
    id: "donor.dob",
    accessorKey: "age",
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
    id: "donor.gender",
    accessorKey: "gender",
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
    accessorKey: "createdAt",
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
      return <div>{row.getValue("createdAt")}</div>;
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
    cell: ({ row }) => <ActionsCell donor={row.original} />,
  },
];
