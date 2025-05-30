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
import { Switch } from "@/components/ui/switch";
import { deleteCourse, updateCourse } from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { FilterIcon, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Course = {
  id: string;
  name: string;
  duration: string;
  status: "active" | "inactive";
  price: number;
  createdAt: string;
  image: {
    url: string;
  };
  category: {
    name: string;
  };
  level: {
    name: string;
  };
};

const ActionsCell = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false); // Control dialog state

  const loading = useSelector((state) => state.course.isLoading);

  const handleDelete = (id: string) => {
    dispatch(
      deleteCourse({
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
        <DropdownMenuItem onClick={() => navigate(`/courses/${course.id}`)}>
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
            title={`Delete ${course?.name}?`}
            onOk={() => handleDelete(course?.id)}
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
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedValues.some((item) => item === option)}
            onCheckedChange={() => handleSelect(option)}
            className="capitalize"
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const updateCourseStatus = (value: boolean, courseId: string) => {
  dispatch(
    updateCourse({
      data: {
        status: value,
      },
      id: courseId,
    })
  );
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link
        to={`/courses/${row?.original?.id}`}
        className="flex items-center gap-2"
      >
        <img
          src={row?.original?.image?.url}
          alt=""
          className="w-10 h-10 aspect-square object-contain"
        />
        {row.getValue("name")}
      </Link>
    ),
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div>Rs. {row.getValue("price")}</div>,
  },

  {
    id: "category",
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div>{row?.original?.category?.name}</div>,
  },

  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.level?.name}</div>,
  },

  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center font-bold"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </button>
      );
    },
    cell: ({ row }) => <div>{row?.getValue("duration")}</div>,
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span className="flex items-center font-bold">Status</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          <Switch
            checked={row?.getValue("status")}
            onCheckedChange={(e) => updateCourseStatus(e, row.original.id)}
          />
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionsCell course={row.original} />,
  },
];
