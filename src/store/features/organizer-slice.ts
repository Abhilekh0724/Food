// api.ts
import api from "@/api";
import { OrganizerI, Role } from "@/lib/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";

// ----------------------------------------------------------------------


const initialState: InitialStateI = {
  isLoading: false,
  fetchLoading: false,
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
const FETCH_ORGANIZERS = "hbb/fetchOrganizers";

// Thunks
export const fetchOrganizers = createAsyncThunk(
  FETCH_ORGANIZERS,
  async ({ params, setIsSearching }: ParamsI & { setIsSearching?: Dispatch<SetStateAction<boolean>> }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI & { organizers: OrganizerI[] }>(
        "organizer-profiles",
        {
          params,
        }
      );
      return { data: response.data, meta: response.data.meta, setIsSearching };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Slice
const organizerSlice = createSlice({
  name: "organizers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchOrganizers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload.data ?? [];
        action.payload.setIsSearching && action.payload.setIsSearching(false);
      })
      .addCase(fetchOrganizers.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });
  }
});

export default organizerSlice.reducer;
