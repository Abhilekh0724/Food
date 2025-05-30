// api.ts
import api from "@/api";
import { BloodGroup, Role, RolesI } from "@/lib/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, ParamsI } from "../interface";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  fetchLoading: false,
  bloodGroups: [] as { label: string; value: string }[],
  roles: {} as RolesI,
};

// Constants
const FETCH_ROLES = "hbb/fetchRoles";
const FETCH_BGS = "hbb/fetchBgs";

// Thunks
export const fetchRoles = createAsyncThunk(
  FETCH_ROLES,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI & { roles: Role[] }>(
        "users-permissions/roles",
        {
          params,
        }
      );
      return { data: response.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBgs = createAsyncThunk(
  FETCH_BGS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("blood-groups", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const roleslice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.roles = action.payload.data;
      })
      .addCase(fetchRoles.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    builder
      .addCase(fetchBgs.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBgs.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.bloodGroups = action.payload.data.map((bg: BloodGroup) => ({
          label: bg.attributes.name,
          value: bg.id,
        }));
      })
      .addCase(fetchBgs.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default roleslice.reducer;
