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
import { BloodRequest } from "@/lib/types";
import { deleteBloodRequest } from "@/store/features/blood-request-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal, X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

const ActionsCell = ({ bloodRequest }: { bloodRequest: BloodRequest }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false); // Control dialog state

  const loading = useSelector((state) => state.bloodRequest.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteBloodRequest({
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
        <DropdownMenuItem
          onClick={() => navigate(`/bloodRequests/${bloodRequest?.id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>

        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild></DialogTrigger>
          <ConfirmDialog
            loading={loading}
            title={`Delete ${bloodRequest?.attributes?.requestedBy?.data?.attributes?.username} bloodRequest?`}
            onOk={() => handleDelete(bloodRequest?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BloodRequest>[] = [
  {
    id: "bloodRequestId",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Requested ID" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => (
      <Link to={`/blood-requests/${row?.original?.id}`}>
        {row?.original?.attributes?.bloodRequestId}
      </Link>
    ),
  },
  {
    id: "district",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="District" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.district}</div>,
  },
  {
    id: "fullName",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Name" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.patientName}</div>,
  },

  {
    accessorKey: "patientAge",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Age" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.patientAge} years</div>,
  },

  {
    id: "patientGender",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Gender" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.patientGender}</div>,
  },

  {
    id: "requestedBloodGroup.id",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Blood Group" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row?.original?.attributes?.requestedBloodGroup?.data?.attributes?.name}
      </div>
    ),
  },

  {
    id: "bloodType",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Blood Type" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.bloodType}</div>,
  },

  {
    id: "needBefore",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Need Before" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => (
      <div>
        {moment(row?.original?.attributes?.needBefore).format("MMM DD, YYYY")} |{" "}
        {moment(row?.original?.attributes?.needBefore).format("HH:mm A")}
      </div>
    ),
  },
  {
    accessorKey: "noOfUnits",
    id: "noOfUnits",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Units" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.noOfUnits} Units</div>,
  },

  {
    accessorKey: "urgency",
    id: "urgency",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Urgency" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.attributes?.urgency}</div>,
  },

  {
    id: "isFulFilled",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Fulfilled?" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        {row?.original?.attributes?.isFulFilled ? (
          <div className="bg-green-500 w-5 h-5 items-center rounded-full text-white flex justify-center">
            <Check />
          </div>
        ) : (
          <div className="bg-red-500 w-5 h-5 items-center rounded-full text-white flex justify-center">
            <X />
          </div>
        )}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posted At" />
    ),
    cell: ({ row }) => (
      <div>{moment(row.getValue("createdAt")).format("MMM DD, YYYY")}</div>
    ),
  },
  // {
  //   id: "actions",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Actions"
  //       className="font-bold"
  //     />
  //   ),
  //   cell: ({ row }) => <ActionsCell bloodRequest={row.original} />,
  // },
];
