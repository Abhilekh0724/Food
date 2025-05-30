// api.ts
import api from "@/api";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
const FETCH_BLOODREQUESTS = "hbb/fetchBloodRequests";
const FETCH_SINGLE_BLOODREQUESTS = "hbb/fetchSingleBloodRequests";
const CREATE_BLOODREQUESTS = "hbb/createBloodRequests";
const UPDATE_BLOODREQUESTS = "hbb/updateBloodRequests";
const UPDATE_BLOODREQUESTS_STATUS = "hbb/updateBloodRequestStatus";
const DELETE_BLOODREQUESTS = "hbb/deleteBloodRequests";
const MARK_COMPLETE = "hbb/completeBloodRequest";

// Thunks
export const fetchBloodRequests = createAsyncThunk(
  FETCH_BLOODREQUESTS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("blood-requests", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleBloodRequests = createAsyncThunk(
  FETCH_SINGLE_BLOODREQUESTS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`blood-requests/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBloodRequest = createAsyncThunk(
  CREATE_BLOODREQUESTS,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    devLog(params, "params");
    try {
      const response = await api.post<ApiResponseI>("bloodRequests", data, {
        params,
      });

      return { data: response.data.data, navigate };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateBloodRequest = createAsyncThunk(
  UPDATE_BLOODREQUESTS,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `bloodRequests/${id}`,
        data,
        {
          params,
        }
      );

      return { data: response.data.data, navigate };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateBloodRequestStatus = createAsyncThunk(
  UPDATE_BLOODREQUESTS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `bloodRequests/${id}/enroll-status`,
        data,
        {
          params,
        }
      );

      return { data: response.data.data, navigate, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const markComplete = createAsyncThunk(
  MARK_COMPLETE,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `bloodRequests/${id}/complete-enroll`,
        data,
        {
          params,
        }
      );

      return { data: response.data.data, navigate, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const deleteBloodRequest = createAsyncThunk(
  DELETE_BLOODREQUESTS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`bloodRequests/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const bloodRequestSlice = createSlice({
  name: "bloodRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodRequests.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBloodRequests.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchBloodRequests.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch single bloodRequest

    builder
      .addCase(fetchSingleBloodRequests.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleBloodRequests.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleBloodRequests.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create bloodRequest

    builder
      .addCase(createBloodRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate("/bloodRequests");
      })
      .addCase(
        createBloodRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodRequest

    builder
      .addCase(updateBloodRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.map((d) => {
            if (d.id === action.payload.data.id) {
              return { ...d, ...action.payload.data };
            } else {
              return d;
            }
          });
        }
        toast.success("Updated successfully.");
        // action.payload.navigate && action.payload.navigate("/bloodRequests");
      })
      .addCase(
        updateBloodRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodRequest status

    builder
      .addCase(updateBloodRequestStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.map((d) => {
            if (d.id === action.payload.data.id) {
              return { ...d, ...action.payload.data };
            } else {
              return d;
            }
          });
        }
        toast.success("Updated successfully.");
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        updateBloodRequestStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodRequest completion

    builder
      .addCase(markComplete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markComplete.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.map((d) => {
            if (d.id === action.payload.data.id) {
              return { ...d, ...action.payload.data };
            } else {
              return d;
            }
          });
        }
        toast.success("Updated successfully.");
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(markComplete.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: delete bloodRequest

    builder
      .addCase(deleteBloodRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBloodRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        deleteBloodRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default bloodRequestSlice.reducer;
