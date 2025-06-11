import { Badge } from "@/components/ui/badge";
import { BloodRequest } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Link } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

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
      <Link to={`/community/blood-needs/${row?.original?.id}`}>
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
    cell: ({ row }) => {
      const urgency = row?.original?.attributes?.urgency;
      const badgeColor =
        urgency === "Urgent"
          ? "bg-red-100 text-red-800"
          : urgency === "Medium"
          ? "bg-yellow-100 text-yellow-800"
          : "";
      return <Badge className={badgeColor}>{urgency}</Badge>;
    },
  },

  {
    id: "isFulFilled",
    header: ({ column }) => (
      <button className="flex items-center font-bold">
        <DataTableColumnHeader column={column} title="Status" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        {row?.original?.attributes?.isFulFilled ? (
          <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-800">Not Fulfilled</Badge>
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
