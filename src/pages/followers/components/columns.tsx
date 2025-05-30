import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Follower = {
  id: string;
  createdAt: string;
  username: string;
  gender: string;
  address: string;
};

export const columns: ColumnDef<Follower>[] = [
  {
    id: "followedBy.username",
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
    cell: ({ row }) => <div>{row.original.username}</div>,
  },

  {
    id: "followedBy.gender",
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
          title="Followed Date"
          className="font-bold"
        />
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("createdAt")}</div>;
    },
  },
];
