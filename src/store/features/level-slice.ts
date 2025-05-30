// api.ts
import api from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI = {
  isLoading: false,
  data: {
    data: [],
    meta: {
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        pageCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  },
};

// Constants
const FETCH_LEVELS = "courses/fetchLevels";

// Thunks
export const fetchLevels = createAsyncThunk(
  FETCH_LEVELS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("courses/levels", {
        params,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(fetchLevels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data.data = action.payload ?? [];
      })
      .addCase(fetchLevels.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default levelSlice.reducer;
