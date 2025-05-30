import { ConfirmDialog } from "@/components/dialog/confirmation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { deleteSuccessStory } from "@/store/features/success-stories-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { FilterIcon, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type SuccessStory = {
  id: string;
  studentName: string;
  position: string;
  story: string;
  company: string;
  course: {
    id: string;
    name: string;
  };
  createdAt: string;
  image: {
    url: string;
  };
};

const ActionsCell = ({ successStory }: { successStory: SuccessStory }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false); // Control dialog state

  const loading = useSelector((state) => state.successStory.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteSuccessStory({
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
          onClick={() => navigate(`/successStorys/${successStory?.id}`)}
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
            title={`Delete ${successStory?.studentName}?`}
            onOk={() => handleDelete(successStory?.id)}
            onClose={() => setOpen(false)}
          />
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterSelect = ({ column, options }: { column: any; options: any[] }) => {
  const selectedValues = (column.getFilterValue() as any[]) || [];

  const handleSelect = (option: any) => {
    const currentFilters = selectedValues || [];

    const isSelected = currentFilters.some((item) => item === option);
    const newFilters = isSelected
      ? currentFilters.filter((item) => item !== option)
      : [...currentFilters, option];

    column.setFilterValue(newFilters.length ? newFilters : undefined);
  };

  const handleReset = () => {
    column.setFilterValue(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <FilterIcon
            size={14}
            className={`${
              selectedValues.length ? "text-primary" : "text-gray-500"
            } font-bold`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuLabel className="flex items-center justify-between">
          Filter by
          {selectedValues.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={handleReset}
            >
              <X size={12} className="text-gray-500" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {options.map((option) => (
            <>
              <DropdownMenuCheckboxItem
                key={option}
                checked={selectedValues.some((item) => item === option)}
                onCheckedChange={() => handleSelect(option)}
                className="capitalize"
              >
                {option}
              </DropdownMenuCheckboxItem>
              <Separator />
            </>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<SuccessStory>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student's Name" />
    ),
    cell: ({ row }) => (
      <Link
        to={`/success-stories/${row?.original?.id}`}
        className="flex items-center gap-2"
      >
        <img
          src={row?.original?.image?.url}
          alt=""
          className="w-10 h-10 aspect-square object-contain"
        />
        {row.getValue("studentName")}
      </Link>
    ),
  },

  {
    accessorKey: "story",
    header: ({ column }) => {
      return <button className="flex items-center font-bold">Story</button>;
    },
    cell: ({ row }) => <div>{row.getValue("story")}</div>,
  },

  {
    id: "position",
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="flex items-center font-bold">Position</span>
        </div>
      );
    },
    cell: ({ row }) => <div>{row?.getValue("position")}</div>,
  },

  {
    id: "company",
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="flex items-center font-bold">Company</span>
        </div>
      );
    },
    cell: ({ row }) => <div>{row?.getValue("company")}</div>,
  },

  {
    id: "course",
    accessorKey: "course",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="flex items-center font-bold">Course</span>
        </div>
      );
    },
    cell: ({ row }) => (
      <Link className="underline" to={`/courses/${row?.original?.course?.id}`}>
        {row?.original?.course?.name || "-"}
      </Link>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionsCell successStory={row.original} />,
  },
];
