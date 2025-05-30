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
import { deleteCategory } from "@/store/features/category-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

const ActionsCell = ({ category }: { category: Category }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false); // Control dialog state

  const loading = useSelector((state) => state.category.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteCategory({
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
          onClick={() => {
            navigate(`/course-categories/${category.id}`);
          }}
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
            title={`Delete ${category?.name}?`}
            onOk={() => handleDelete(category?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        to={`/course-categories/${row?.original?.id}`}
        className="flex items-center gap-2"
      >
        {row.getValue("name")}
      </Link>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
];
