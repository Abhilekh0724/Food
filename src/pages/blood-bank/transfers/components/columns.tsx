import { ConfirmDialog } from "@/components/dialog/confirmation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { BloodTransferI } from "@/lib/types";
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice";
import { updateBloodTransferRequest } from "@/store/features/blood-transfer-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ActionsCell = ({ transfer }: { transfer: BloodTransferI }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Cancel' | 'Complete' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedPouches, setSelectedPouches] = useState<string[]>([]);
  const [transferDate, setTransferDate] = useState<Date | undefined>(new Date());

  const loading = useSelector((state) => state.bloodTransfer.isLoading);
  const { user } = useAuth();

  const pouches = useSelector((state) => state.bloodPouch.data);

  useEffect(() => {
    if (actionType === 'Approve') {
      dispatch(fetchBloodPouches({
        params: {
          filters: {
            isUsed: false,
            isWasted: false,
            organizer: {
              id: user?.organizerProfile?.id
            },
            $and: [
              { bloodGroup: { name: transfer.bloodGroup } },
              { bloodType: transfer.bloodType },
              {
                $or: [
                  { bloodPouchRequests: { id: { $null: true } } }, // No request exists
                  {
                    bloodPouchRequests: {
                      status: { $eq: "Reject" } // If request exists, status must be "Reject"
                    }
                  }
                ]
              }
            ]
          },
          pagination: {
            pageSize: 1000,
            page: 1,
          },
        }
      }))
    }
  }, [actionType, user?.organizerProfile?.id, transfer.bloodType, transfer.bloodGroup])


  const handleAction = () => {
    if (!actionType) return;

    const data = {
      status: actionType,
      statusMessage: actionType === 'Approve'
        ? selectedOptions.join(', ')
        : statusMessage,
      ...(actionType === 'Approve' && { approvedAt: new Date(), requestedBloodPouches: selectedPouches }),
      ...(actionType === 'Reject' && { rejectedAt: new Date() }),
      ...(actionType === 'Cancel' && { cancelledAt: new Date() }),
      ...(actionType === 'Complete' && { transferAt: transferDate, status: 'Transfer' }),
    }


    dispatch(updateBloodTransferRequest({
      data, id: transfer.id, status: actionType, // 'APPROVE' or 'REJECT'
      actionBy: user?.id,
      onClose: () => {
        setDialogOpen(false);
        setStatusMessage('');
        setSelectedOptions([]);
        setActionType(null);
      }
    }));
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

        {transfer?.tab === 'incoming' && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setActionType('Approve');
                setDialogOpen(true);
              }}
            >
              Approve
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setActionType('Reject');
                setDialogOpen(true);
              }}
            >
              Reject
            </DropdownMenuItem>

            {transfer?.status?.toLowerCase() === 'approve' && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setActionType('Complete');
                  setDialogOpen(true);
                }}
              >
                Complete Transfer
              </DropdownMenuItem>
            )}
          </>
        )}

        {transfer?.tab === 'outgoing' && (
          <DropdownMenuItem
            disabled={transfer?.status?.toLowerCase() !== 'pending'}
            onClick={(e) => {
              e.preventDefault();
              setActionType('Cancel');
              setDialogOpen(true);
            }}
          >
            Cancel
          </DropdownMenuItem>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <ConfirmDialog
            loading={loading}
            title={`${actionType?.toUpperCase()} Blood Transfer Request?`}
            description={
              actionType === 'Approve' ? (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select blood pouches
                    </label>
                    <MultiSelect
                      showSelectAll={false}
                      options={pouches?.data?.map(p => ({
                        label: p?.attributes?.pouchId,
                        value: p?.id,
                      })) || []}
                      onValueChange={setSelectedPouches}
                      placeholder="Select pouches"
                      variant="inverted"
                      animation={2}
                    />
                  </div>
                  {selectedOptions.includes("Other (specify in message)") && (
                    <div>
                      <label htmlFor="approvalMessage" className="block text-sm font-medium text-gray-700">
                        Additional Message
                      </label>
                      <Textarea
                        id="approvalMessage"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Enter additional comments..."
                        value={statusMessage}
                        onChange={(e) => setStatusMessage(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ) : actionType === 'Complete' ? (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Transfer Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transferDate ? format(transferDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={transferDate}
                          onSelect={setTransferDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label htmlFor="transferMessage" className="block text-sm font-medium text-gray-700">
                      Transfer Notes (Optional)
                    </label>
                    <Textarea
                      id="transferMessage"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Enter any notes about the transfer..."
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                    />
                  </div>
                </div>
              ) : (actionType === 'Reject' || actionType === 'Cancel') ? (
                <div className="mt-4">
                  <label htmlFor="statusMessage" className="block text-sm font-medium text-gray-700">
                    {actionType} Reason
                  </label>
                  <Textarea
                    id="statusMessage"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Enter reason for rejection..."
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    required
                  />
                </div>
              ) : (
                "Are you sure you want to cancel this transfer request?"
              )
            }
            onOk={handleAction}
            onClose={() => {
              setDialogOpen(false);
              setStatusMessage('');
              setSelectedOptions([]);
              setActionType(null);
            }}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<BloodTransferI>[] = [
  {
    id: "toOrganizer",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Requester" />
        </button>
      );
    },
    cell: ({ row }) => (
      <Link to={`/blood-transfers/${row?.original?.id}`}>
        {row?.original?.requester?.attributes?.name}
      </Link>
    ),
  },
  {
    id: "bloodType",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Blood Type" />
        </button>
      );
    },
    cell: ({ row }) => <div className="flex flex-wrap items-center gap-2">{row?.original?.bloodType}</div>,
  },
  {
    id: "bloodGroup.id",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Blood Groups" />
        </button>
      );
    },
    cell: ({ row }) => <div className="flex flex-wrap items-center gap-2">{row?.original?.bloodGroup}</div>,
  },
  {
    id: "noOfUnits",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Required Units" />
        </button>
      );
    },
    cell: ({ row }) => <div className="flex flex-wrap items-center gap-2">{row?.original?.noOfUnits}</div>,
  },
  {
    id: "purpose",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Purpose" />
        </button>
      );
    },
    cell: ({ row }) => <div className="flex flex-wrap items-center gap-2">{row?.original?.purpose}</div>,
  },
  {
    accessorKey: "requestedDate",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Requested Date" />
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.requestedDate}</div>,
  },
  {
    id: "status",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Status" />
        </button>
      );
    },
    cell: ({ row }) => {
      const status = row?.original?.status?.toLowerCase();
      let bgColor = "";
      let textColor = "";

      switch (status) {
        case "pending":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          break;
        case "approve":
          bgColor = "bg-indigo-100";
          textColor = "text-indigo-800";
          break;
        case "reject":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          break;
        case "transfer":
          bgColor = "bg-purple-100";
          textColor = "text-purple-800";
          break;
        default:
          bgColor = "bg-gray-100";
          textColor = "text-gray-800";
      }

      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} text-center`}>
          {row?.original?.status === 'Approve' ? "Approved" : row?.original?.status === 'Transfer' ? "Transferred" : row?.original?.status === 'Reject' ? "Rejected" : row?.original?.status === 'Cancel' ? "Cancelled" : row?.original?.status}
        </div>
      );
    },
  },
  {
    id: "message",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
        >
          <DataTableColumnHeader column={column} title="Message" />
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.message ?? "-"}</div>,
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
    cell: ({ row }) => <ActionsCell transfer={row.original} />,
  },
];
