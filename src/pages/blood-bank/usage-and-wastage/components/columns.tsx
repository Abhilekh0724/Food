import { ConfirmDialog } from "@/components/dialog/confirmation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { BloodUsage } from "@/lib/types";
import { deleteBloodPoucht, updateBloodPouch } from "@/store/features/blood-pouch-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

const ActionsCell = ({ stock }: { stock: BloodUsage }) => {

  const [open, setOpen] = useState<boolean>(false); // Control dialog state

  const loading = useSelector((state) => state.bloodPouch.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteBloodPoucht({
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
            title={`Delete Pouch : ${stock?.pouchId}?`}
            onOk={() => handleDelete(stock?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const handleMarkAsUsed = (value: boolean, id: string) => {
  dispatch(
    updateBloodPouch({
      data: {
        isUsed: value,
        usedAt: new Date()
      },
      id,
    })
  );
};


export const columns: ColumnDef<BloodUsage>[] = [
  {
    id: "pouchId",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Pouch ID" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => (
      <Link to={`/blood-stocks/${row?.original?.id}`}>
        {row?.original?.pouchId}
      </Link>
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
    cell: ({ row }) => <div>{row?.original?.bloodType}</div>,
  },

  {
    id: "bloodGroup",
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
    cell: ({ row }) => <div>{row?.original?.bloodGroup}</div>,
  },
  {
    id: "donationDate",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Donation Date" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.donationDate}</div>,
  },

  {
    accessorKey: "expiry",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Expiry Date" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.expiryDate} years</div>,
  },

  {
    id: "donor",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Donor ID" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.donorId}</div>,
  },

  // {
  //   id: "isUsed",
  //   header: ({ column }) => {
  //     return (
  //       <button
  //         className="flex items-center font-bold"
  //       // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <DataTableColumnHeader column={column} title="Mark as used" />
  //         {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
  //       </button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return <Switch
  //       checked={row.original.isUsed}
  //       onCheckedChange={(e) => handleMarkAsUsed(e, row.original.id)}
  //     />
  //   },
  // },

  {
    id: "usedAt",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DataTableColumnHeader column={column} title="Used At" />
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.usedAt}</div>,
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
    cell: ({ row }) => <ActionsCell stock={row.original} />,
  },
];
