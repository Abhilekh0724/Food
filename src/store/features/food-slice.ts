import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FoodItem } from "@/lib/types";

// Mock API simulation (replace with real API calls)
const mockApi = {
  fetch: async (): Promise<FoodItem[]> => Promise.resolve([
    {
      id: "1",
      name: "Margherita Pizza",
      category: "Main Course",
      price: 12.99,
      available: true,
      special: true,
      description: "Classic pizza with tomato, mozzarella, and basil.",
      addedDate: "2024-06-01",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      preparationTime: 20,
    },
    {
      id: "2",
      name: "Caesar Salad",
      category: "Appetizer",
      price: 7.5,
      available: true,
      special: false,
      description: "Crisp romaine lettuce with Caesar dressing and croutons.",
      addedDate: "2024-06-02",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      preparationTime: 15,
    },
    {
      id: "3",
      name: "Chocolate Lava Cake",
      category: "Dessert",
      price: 6.0,
      available: false,
      special: false,
      description: "Warm chocolate cake with a gooey center.",
      addedDate: "2024-06-03",
      imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
      preparationTime: 30,
    },
  ]),
  delete: async (id: string) => Promise.resolve(id),
  update: async (item: FoodItem) => Promise.resolve(item),
};

export const fetchFoodItems = createAsyncThunk("food/fetchAll", async () => {
  return await mockApi.fetch();
});

export const deleteFoodItem = createAsyncThunk(
  "food/delete",
  async (id: string) => {
    await mockApi.delete(id);
    return id;
  }
);

export const updateFoodItem = createAsyncThunk(
  "food/update",
  async (item: FoodItem) => {
    const updated = await mockApi.update(item);
    return updated;
  }
);

interface FoodState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action: PayloadAction<FoodItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch food items";
      })
      .addCase(deleteFoodItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateFoodItem.fulfilled, (state, action: PayloadAction<FoodItem>) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  },
});

export default foodSlice.reducer; 