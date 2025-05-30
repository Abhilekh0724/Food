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
const FETCH_FOLLOWERS = "organizer-fetchFollowers";
const FETCH_SINGLE_FOLLOWERS = "organizer-fetchSingleFollowers";
const CREATE_FOLLOWERS = "organizer-createFollowers";
const UPDATE_FOLLOWERS = "organizer-updateFollowers";
const UPDATE_FOLLOWERS_STATUS = "organizer-updateFollowerStatus";
const DELETE_FOLLOWERS = "organizer-deleteFollowers";
const MARK_COMPLETE = "organizer-completeFollower";

// Thunks
export const fetchFollowers = createAsyncThunk(
  FETCH_FOLLOWERS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`organizer-followers`, {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleFollowers = createAsyncThunk(
  FETCH_SINGLE_FOLLOWERS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`users/${id}`, {
        params,
      });
      return { data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createFollower = createAsyncThunk(
  CREATE_FOLLOWERS,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    devLog(params, "params");
    try {
      const response = await api.post<ApiResponseI>("followers", data, {
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

export const updateFollower = createAsyncThunk(
  UPDATE_FOLLOWERS,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(`followers/${id}`, data, {
        params,
      });

      return { data: response.data.data, navigate };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateFollowerStatus = createAsyncThunk(
  UPDATE_FOLLOWERS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `followers/${id}/enroll-status`,
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
        `followers/${id}/complete-enroll`,
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

export const deleteFollower = createAsyncThunk(
  DELETE_FOLLOWERS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`followers/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const followerSlice = createSlice({
  name: "follower",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(fetchFollowers.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single follower

    builder
      .addCase(fetchSingleFollowers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleFollowers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleFollowers.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create follower

    builder
      .addCase(createFollower.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFollower.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate("/followers");
      })
      .addCase(createFollower.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update follower

    builder
      .addCase(updateFollower.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFollower.fulfilled, (state, action) => {
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
        // action.payload.navigate && action.payload.navigate("/followers");
      })
      .addCase(updateFollower.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update follower status

    builder
      .addCase(updateFollowerStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFollowerStatus.fulfilled, (state, action) => {
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
        updateFollowerStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update follower completion

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

    // TODO: delete follower

    builder
      .addCase(deleteFollower.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFollower.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteFollower.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default followerSlice.reducer;
