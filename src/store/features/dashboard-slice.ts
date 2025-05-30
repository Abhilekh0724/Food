// api.ts
import api from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI = {
  isLoading: false,
  stats: null,
};

// Constants
const DASHBAORD_STATS = "dashboard/stats";

// Thunks
export const getDashboardStats = createAsyncThunk(
  DASHBAORD_STATS,
  async ({ params }: any, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("courses/dashboard/stats", {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(
        getDashboardStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default authSlice.reducer;
