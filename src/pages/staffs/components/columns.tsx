import { ConfirmDialog } from "@/components/dialog/confirmation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteStaff } from "@/store/features/staff-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Staff = {
  id: string;
  userId: string;
  createdAt: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
};

const ActionsCell = ({ staff }: { staff: Staff }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const loading = useSelector((state) => state.staff.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteStaff({
        id,
        onClose: () => setOpen(false),
      })
    );
  };

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
        <DropdownMenuItem onClick={() => navigate(`/staffs/edit/${staff?.id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}>
          Delete
        </DropdownMenuItem>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild></DialogTrigger>
          <ConfirmDialog
            loading={loading}
            title={`Delete Staff: ${staff?.username}?`}
            onOk={() => handleDelete(staff?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Staff>[] = [
  {
    id: "user.username",
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Full Name"
        className="font-bold"
      />
    ),
    cell: ({ row }) => (
      <div>{row.original.username}</div>
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
    id: "user.dob",
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
    id: "user.gender",
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
    cell: ({ row }) => <ActionsCell staff={row.original} />,
  },
];
