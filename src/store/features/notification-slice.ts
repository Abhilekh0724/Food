// api.ts
import api from "@/api";
import { ActionTypes } from "@/lib/enum";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";
import { createActivity } from "./activity-slice";

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
const FETCH_NOTIFICATIONS = "hbb/fetchDonors";
const FETCH_SINGLE_NOTIFICATIONS = "hbb/fetchSingleDonors";
const CREATE_NOTIFICATIONS = "hbb/createNotifications";
const UPDATE_NOTIFICATION = "hbb/updateDonorProfile";
const UPDATE_NOTIFICATIONS_STATUS = "hbb/updateDonorStatus";
const DELETE_NOTIFICATIONS = "hbb/deleteDonors";
const MARK_COMPLETE = "hbb/completeDonor";

// Thunks
export const fetchDonors = createAsyncThunk(
  FETCH_NOTIFICATIONS,
  async ({ params, setIsSearching }: ParamsI & { setIsSearching?: Dispatch<SetStateAction<boolean>> }, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("organizer-donors", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta, setIsSearching };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleDonors = createAsyncThunk(
  FETCH_SINGLE_NOTIFICATIONS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`organizer-donors/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  CREATE_NOTIFICATIONS,
  async (
    {
      data,
      onClose,
      actionBy
    }: ParamsI & {
      actionBy: string | undefined;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const responseUser = await api.post<ApiResponseI>("strapi-plugin-fcm/fcm-notifications", { data });

      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.CREATED,
            description: `Created a new member with member ID: ${responseUser.data.id}`,
            modelName: "User",
          },
        })
      );

      return { data: responseUser.data.data, onClose };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);



export const updateDonorProfile = createAsyncThunk(
  UPDATE_NOTIFICATION,
  async (
    { data, params, id, navigate }: ParamsI & { actionBy: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponseI>(
        `donor-profiles/${id}`,
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

export const updateDonorStatus = createAsyncThunk(
  UPDATE_NOTIFICATIONS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `donors/${id}/enroll-status`,
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
        `donors/${id}/complete-enroll`,
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

export const deleteDonor = createAsyncThunk(
  DELETE_NOTIFICATIONS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`donors/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const donorSlice = createSlice({
  name: "donor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
        action.payload.setIsSearching && action.payload.setIsSearching(false);
      })
      .addCase(fetchDonors.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single donor

    builder
      .addCase(fetchSingleDonors.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleDonors.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleDonors.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create donor

    builder
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.onClose &&
          action.payload.onClose();
      })
      .addCase(createNotification.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });


    // TODO: update donor status

    builder
      .addCase(updateDonorStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDonorStatus.fulfilled, (state, action) => {
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
        updateDonorStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update donor completion

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

    // TODO: delete donor

    builder
      .addCase(deleteDonor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDonor.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteDonor.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default donorSlice.reducer;
