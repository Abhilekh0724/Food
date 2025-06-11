import DashboardBreadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FoodItem } from "@/lib/types";
import { useSelector } from "@/store/store";
import { foodColumns } from "./components/food-columns";
import FoodTable from "./components/food-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

export default function FoodItemsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Static food items
  const foodItems: FoodItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Pizza",
      price: 12.99,
      available: true,
      description: "Classic pizza with tomato sauce, mozzarella, and basil.",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
      preparationTime: 20,
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Salad",
      price: 8.5,
      available: true,
      description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing.",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      preparationTime: 15,
    },
    {
      id: "3",
      name: "Grilled Chicken Burger",
      category: "Burger",
      price: 10.0,
      available: false,
      description: "Juicy grilled chicken breast, lettuce, tomato, and aioli.",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      preparationTime: 25,
    },
    {
      id: "4",
      name: "Chocolate Lava Cake",
      category: "Dessert",
      price: 6.75,
      available: true,
      description: "Warm chocolate cake with a gooey molten center.",
      imageUrl: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80",
      preparationTime: 30,
    },
  ];

  // Filtered food items based on search
  const filteredData: FoodItem[] = useMemo(() => {
    return foodItems.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, foodItems]);

  const table = useReactTable({
    data: filteredData,
    columns: foodColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const breadcrumbItems = [{ label: "Food Items", href: "/food-items" }];

  return (
    <div className="w-full min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 pt-8">
          <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
        </div>
        <div className="flex items-start justify-between gap-10 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground font-serif">Food Items</h2>
              <span className="text-base text-muted-foreground font-medium">Total items: {foodItems.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-1">
            <Input
              placeholder="Search by name or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full"
            />
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/blood-stocks/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-lg p-4">
          <FoodTable
            table={table}
            pagination={pagination}
            setPagination={setPagination}
            data={filteredData}
          />
        </div>
      </div>
    </div>
  );
}
