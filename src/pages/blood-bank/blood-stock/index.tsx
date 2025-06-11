import DashboardBreadcrumb from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, Plus, Droplet, Calendar, User, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BloodUnit, FoodItem } from "@/lib/types";
import { useDispatch, useSelector } from "@/store/store";
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function FoodItemsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Salad",
      price: 8.5,
      available: true,
      description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing.",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      name: "Grilled Chicken Burger",
      category: "Burger",
      price: 10.0,
      available: false,
      description: "Juicy grilled chicken breast, lettuce, tomato, and aioli.",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      name: "Chocolate Lava Cake",
      category: "Dessert",
      price: 6.75,
      available: true,
      description: "Warm chocolate cake with a gooey molten center.",
      imageUrl: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Filtered food items based on search
  const filteredData: FoodItem[] = foodItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const breadcrumbItems = [{ label: "Food Items", href: "/food-items" }];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-pink-100 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 pt-8">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>
        <div className="flex items-start justify-between gap-10 mb-6">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild className="bg-white/80 hover:bg-red-100 border-red-200">
            <Link to="/">
                <ChevronLeft className="h-5 w-5 text-red-500" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-red-700 font-serif drop-shadow-sm">Food Items</h2>
              <span className="text-base text-red-500 font-medium">Total items: {foodItems.length}</span>
            </div>
          </div>
        <div className="flex items-center space-x-2 flex-1">
          <Input
              placeholder="Search by name or category..."
            value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-white/80 border-red-200 focus:ring-red-400"
            />
            <Button 
              className="bg-gradient-to-r from-red-400 to-pink-300 text-white font-bold shadow-md hover:from-red-500 hover:to-pink-400"
              onClick={() => navigate("/blood-stocks/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
          </Button>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-red-700">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-red-500">
                      {item.category}
                    </CardDescription>
                  </div>
                  <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Droplet className="h-4 w-4 text-red-400" />
                    <span>Price: ${item.price.toFixed(2)}</span>
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-700">
                      {item.description}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex justify-end w-full gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => navigate(`/food-items/${item.id}`)}
                  >
                    View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/food-items/edit/${item.id}`)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/food-items/${item.id}`)}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
