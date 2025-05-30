import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// Types
import { BloodUnit } from "@/lib/types";

// Store
import { dispatch, useSelector } from "@/store/store";
import { deleteBloodPoucht, updateBloodPouch } from "@/store/features/blood-pouch-slice";

// Components
import { ConfirmDialog } from "@/components/dialog/confirmation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Utils
import { devInfo, devLog } from "@/util/logger";
import { DataTableColumnHeader } from "./data-table-column-header";
import { MarkAsUsedForm } from "./mark-as-used-form";

interface ReceiverInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  district: string;
  occupation: string;
  country: string;
  municipality: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  wardNo: string;
  usedPurpose?: string;
}

const ActionsCell = ({ stock }: { stock: BloodUnit }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false);
  const [openUsedForm, setOpenUsedForm] = useState<boolean>(false);
  const [openWastedForm, setOpenWastedForm] = useState<boolean>(false);
  const [reason, setReason] = useState("");

  const loading = useSelector((state) => state.bloodPouch.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteBloodPoucht({
        id,
        onClose: () => setOpen(false),
      })
    );
  };

  const handleMarkAsUsed = (receiverInfo: ReceiverInfo) => {
    const usedPurpose = receiverInfo.usedPurpose
    delete receiverInfo.usedPurpose
    dispatch(
      updateBloodPouch({
        data: {
          isUsed: true,
          usedAt: new Date().toISOString(),
          usedBy: receiverInfo,
          usedPurpose
        },
        id: stock.id,
        onClose: () => setOpenUsedForm(false),
      })
    );
  };

  const handleMarkAsWasted = () => {
    if (!reason.trim()) return;

    dispatch(
      updateBloodPouch({
        data: {
          isWasted: true,
          wastedAt: new Date().toISOString(),
          statusMessage: reason
        },
        id: stock.id,
        onClose: () => {
          setOpenWastedForm(false);
          setReason("");
        },
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
            setOpenUsedForm(true);
          }}>
          Mark Used
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpenWastedForm(true);
          }}>
          Mark Wasted
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            navigate(`/blood-stocks/edit/${stock?.id}`);
          }}>
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
            title={`Delete Pouch: ${stock?.pouchId}?`}
            onOk={() => handleDelete(stock?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>

        <Dialog open={openUsedForm} onOpenChange={setOpenUsedForm}>
          <DialogTrigger asChild />
          <MarkAsUsedForm
            onConfirm={handleMarkAsUsed}
            onCancel={() => setOpenUsedForm(false)}
            pouchId={stock.pouchId}
          />
        </Dialog>

        <Dialog open={openWastedForm} onOpenChange={setOpenWastedForm}>
          <DialogTrigger asChild />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Pouch {stock.pouchId} as Wasted</DialogTitle>
              <DialogDescription>
                Please provide the reason for wasting this blood pouch.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Label htmlFor="reason" className="">
                Reason
              </Label>
              <Textarea
                id="reason"
                className="col-span-3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for wasting this blood pouch..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenWastedForm(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleMarkAsWasted}
                disabled={!reason.trim()}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BloodUnit>[] = [
  {
    id: "pouchId",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Pouch ID" />
      </button>
    ),
    cell: ({ row }) => (
      <Link to={`/blood-stocks/${row?.original?.id}`} className='underline'>
        {row?.original?.pouchId}
      </Link>
    ),
  },
  {
    id: "bloodType",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Blood Type" />
      </button>
    ),
    cell: ({ row }) => <div>{row?.original?.bloodType}</div>,
  },
  {
    id: "bloodGroup.id",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Blood Group" />
      </button>
    ),
    cell: ({ row }) => <div>{row?.original?.bloodGroup}</div>,
  },
  {
    id: "donationDate",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Donation Date" />
      </button>
    ),
    cell: ({ row }) => <div>{row?.original?.donationDate}</div>,
  },
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Expiry Date" />
      </button>
    ),
    cell: ({ row }) => <div>{row?.original?.expiryDate}</div>,
  },
  {
    id: "donor",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Donor ID" />
      </button>
    ),
    cell: ({ row }) => <div>{row?.original?.donorId}</div>,
  },

  {
    id: "status",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Status" />
      </button>
    ),
    // cell: ({ row }) => <MarkAsUsedSwitch stock={row.original} />,
    cell: ({ row }) => <div>
      {row?.original?.isUsed ? (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
          Used
        </span>
      ) : row?.original?.isWasted ? (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
          Wasted
        </span>
      ) : row?.original?.isApproved ? (
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-purple-900 dark:text-purple-300">
          Approved
        </span>
      ) : row?.original?.isTransferred ? <span className="bg-purple-100 text-purple-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
        Transferred
      </span> : <span className="bg-green-100 text-green-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
        Available
      </span>}
    </div>
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
