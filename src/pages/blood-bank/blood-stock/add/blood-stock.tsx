import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  createBloodPouch,
  fetchSingleBloodPouches,
  updateBloodPouch,
} from "@/store/features/blood-pouch-slice";
import { fetchDonors } from "@/store/features/donor-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { generateRandomString } from "@/util/random";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { foodMenuSchema, FormValues } from "../schema/blood-stock-schema";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";

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
}

interface Donor {
  id: string;
  attributes: {
    donor: {
      data: {
        attributes: {
          username: string;
        };
        id: string;
      };
    };
  };
}

const ReceiverInfoForm = ({
  receiverInfo,
  onSave,
  onCancel,
  isSubmitting,
}: {
  receiverInfo?: ReceiverInfo;
  onSave: (data: ReceiverInfo) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<ReceiverInfo>({
    firstName: receiverInfo?.firstName || "",
    lastName: receiverInfo?.lastName || "",
    email: receiverInfo?.email || "",
    phone: receiverInfo?.phone || "",
    district: receiverInfo?.district || "",
    occupation: receiverInfo?.occupation || "",
    country: receiverInfo?.country || "",
    municipality: receiverInfo?.municipality || "",
    city: receiverInfo?.city || "",
    streetAddress: receiverInfo?.streetAddress || "",
    zipCode: receiverInfo?.zipCode || "",
    wardNo: receiverInfo?.wardNo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DialogContent className="max-w-4xl bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-red-700">Receiver Information</DialogTitle>
        <DialogDescription className="text-red-500">
          Details of the person who received this blood pouch
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-red-700 font-medium">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-red-700 font-medium">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-red-700 font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-red-700 font-medium">Phone*</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district" className="text-red-700 font-medium">District*</Label>
          <Input
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-red-700 font-medium">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="bg-white/80 border-red-200 focus:ring-red-400"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-red-200 hover:bg-red-100">
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.phone ||
            isSubmitting
          }
          className="bg-gradient-to-r from-red-400 to-pink-300 text-white font-bold shadow-md hover:from-red-500 hover:to-pink-400"
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const foodCategories = [
  "Pizza",
  "Burger",
  "Pasta",
  "Salad",
  "Dessert",
  "Drink",
  "Appetizer",
  "Main Course",
  "Side Dish",
];

const pizzaTypes = [
  "Margherita",
  "Pepperoni",
  "Chicken",
  "Vegetarian",
  "Hawaiian",
  "BBQ Chicken",
  "Supreme",
  "Custom",
];

const burgerTypes = [
  "Classic",
  "Cheese",
  "Chicken",
  "Veggie",
  "Double Patty",
  "Spicy",
  "Custom",
];

const pastaTypes = [
  "Spaghetti",
  "Fettuccine",
  "Penne",
  "Lasagna",
  "Ravioli",
  "Custom",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
];

const AddFoodItem = ({ isEdit = false }: { isEdit?: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(foodMenuSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
      imageUrl: undefined,
      available: true,
      preparationTime: 0,
      calories: 0,
      ingredients: [],
      dietaryInfo: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with data:", {
      ...data,
      category: selectedCategory,
      type: data.type || "Custom"
    });
    
    // Log the selected category and type
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Type:", data.type);
    
    // TODO: Implement form submission
    toast.success("Food item added successfully!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/blood-stocks"); // Navigate back to the food items list
  };

  const getTypeOptions = (category: string) => {
    switch (category.toLowerCase()) {
      case "pizza":
        return pizzaTypes;
      case "burger":
        return burgerTypes;
      case "pasta":
        return pastaTypes;
      default:
        return [];
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("category", value);
    form.setValue("type", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="my-6 p-2 sm:p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-gray-600" />
              {isEdit ? "Update" : "Add New"} Food Item
            </CardTitle>
            <CardDescription>
              Enter the food item details to {isEdit ? "update" : "add"} it to the menu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Food Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white/80 border-gray-200 focus:ring-gray-400"
                        placeholder="Enter food name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Category *</FormLabel>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/80 border-gray-200 focus:ring-gray-400">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {foodCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCategory}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/80 border-gray-200 focus:ring-gray-400">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getTypeOptions(selectedCategory).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                        {selectedCategory && (
                          <SelectItem value="custom">
                            Custom {selectedCategory} Type
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type or variation of the {selectedCategory.toLowerCase()}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Price *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-[50%] h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9 bg-white/80 border-gray-200 focus:ring-gray-400"
                          placeholder="Enter price"
                          type="number"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          onFocus={(e) => {
                            if (field.value === 0) {
                              e.target.value = "";
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              field.onChange(0);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preparationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Preparation Time (minutes) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-[50%] h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-9 bg-white/80 border-gray-200 focus:ring-gray-400"
                          placeholder="Enter preparation time"
                          type="number"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                          onFocus={(e) => {
                            if (field.value === 0) {
                              e.target.value = "";
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              field.onChange(0);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-white/80 border-gray-200 focus:ring-gray-400"
                      placeholder="Enter food description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Available</FormLabel>
                    <FormDescription>
                      Toggle to mark this item as available or unavailable
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEdit ? "Update Food Item" : "Add Food Item"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default AddFoodItem;
