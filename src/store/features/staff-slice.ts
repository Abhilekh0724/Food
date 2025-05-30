// api.ts
import api from "@/api";
import { ActionTypes } from "@/lib/enum";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
const FETCH_STAFFS = "hbb/fetchStaffs";
const FETCH_SINGLE_STAFFS = "hbb/fetchSingleStaffs";
const CREATE_STAFFS = "hbb/createStaffs";
const UPDATE_STAFFS = "hbb/updateStaffs";
const UPDATE_STAFFS_STATUS = "hbb/updateStaffStatus";
const DELETE_STAFFS = "hbb/deleteStaffs";
const MARK_COMPLETE = "hbb/completeStaff";

// Thunks
export const fetchStaffs = createAsyncThunk(
  FETCH_STAFFS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("organizer-members", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleStaffs = createAsyncThunk(
  FETCH_SINGLE_STAFFS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`organizer-members/${id}`, {
        params,
      });
      return { data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createStaff = createAsyncThunk(
  CREATE_STAFFS,
  async (
    {
      data,
      params,
      navigate,
      staff,
      actionBy,
    }: ParamsI & {
      staff: { organizer?: string; role: string };
      actionBy?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const responseUser = await api.post<ApiResponseI>("users", data, {
        params,
      });

      const responseOrganizer = await api.post<ApiResponseI>(
        "organizer-members",
        {
          data: {
            ...staff,
            user: responseUser.data.id,
          },
        },
        {
          params,
        }
      );

      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.CREATED,
            description: `Created a new staff with staff ID: ${responseUser.data.id}`,
            modelName: "User",
          },
        })
      );

      return { data: responseOrganizer.data.data, navigate };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateStaff = createAsyncThunk(
  UPDATE_STAFFS,
  async (
    { data, params, id, navigate }: ParamsI & { actionBy?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponseI>(`users/${id}`, data, {
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

export const updateStaffStatus = createAsyncThunk(
  UPDATE_STAFFS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `staffs/${id}/enroll-status`,
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
        `staffs/${id}/complete-enroll`,
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

export const deleteStaff = createAsyncThunk(
  DELETE_STAFFS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`staffs/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(fetchStaffs.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single staff

    builder
      .addCase(fetchSingleStaffs.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleStaffs.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleStaffs.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create staff

    builder
      .addCase(createStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate &&
          action.payload.navigate(`/staffs/${action.payload.data.id}`);
      })
      .addCase(createStaff.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update staff

    builder
      .addCase(updateStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
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
        // action.payload.navigate && action.payload.navigate("/staffs");
      })
      .addCase(updateStaff.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update staff status

    builder
      .addCase(updateStaffStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStaffStatus.fulfilled, (state, action) => {
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
        updateStaffStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update staff completion

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

    // TODO: delete staff

    builder
      .addCase(deleteStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteStaff.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default staffSlice.reducer;
