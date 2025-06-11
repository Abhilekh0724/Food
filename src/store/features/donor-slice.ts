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

const initialState: InitialStateI & { donationCount: number } = {
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
  donationCount: 0,
};

// Constants
const FETCH_DONORS = "hbb/fetchDonors";
const FETCH_SINGLE_DONORS = "hbb/fetchSingleDonors";
const CREATE_DONORS = "hbb/createDonors";
const UPDATE_DONORS = "hbb/updateDonors";
const UPDATE_DONOR_PROFILE = "hbb/updateDonorProfile";
const UPDATE_DONORS_STATUS = "hbb/updateDonorStatus";
const DELETE_DONORS = "hbb/deleteDonors";
const MARK_COMPLETE = "hbb/completeDonor";
const GET_DONATION_COUNT = "hbb/getDonationCount";

// Thunks
export const fetchDonors = createAsyncThunk(
  FETCH_DONORS,
  async (
    {
      params,
      setIsSearching,
    }: ParamsI & { setIsSearching?: Dispatch<SetStateAction<boolean>> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponseI>("organizer-donors", {
        params,
      });
      return {
        data: response.data.data,
        meta: response.data.meta,
        setIsSearching,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleDonors = createAsyncThunk(
  FETCH_SINGLE_DONORS,
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

export const getDonationCount = createAsyncThunk(
  GET_DONATION_COUNT,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`b-request-acceptors`, {
        params,
      });
      return { data: response.data.meta?.pagination.total };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDonor = createAsyncThunk(
  CREATE_DONORS,
  async (
    {
      data,
      params,
      navigate,
      donor,
      organizer,
      actionBy,
      verifyDonor = false,
    }: ParamsI & {
      donor: { user?: string; donorId: string };
      organizer?: string;
      actionBy: string | undefined;
      verifyDonor?: boolean;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const responseUser = await api.post<ApiResponseI>(
        "users-permissions/users/createWithCustomFields",
        data,
        {
          params,
        }
      );

      await api.post<ApiResponseI>(
        "donor-profiles",
        {
          data: {
            ...donor,
            user: responseUser.data.id,
            status: verifyDonor ? "Verified" : "Pending",
          },
        },
        {
          params,
        }
      );

      const orgDonorResponse = await api.post<ApiResponseI>(
        "organizer-donors",
        {
          data: {
            donor: responseUser?.data?.id,
            organizer,
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
            description: `Created a new member with member ID: ${responseUser.data.id}`,
            modelName: "User",
          },
        })
      );

      return { data: orgDonorResponse.data.data, navigate };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateDonor = createAsyncThunk(
  UPDATE_DONORS,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `users-permissions/users/${id}/updateWithCustomFields`,
        data,
        {
          params,
        }
      );

      console.log("first", response.data);

      return { data: response.data.data, navigate };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateDonorProfile = createAsyncThunk(
  UPDATE_DONOR_PROFILE,
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
  UPDATE_DONORS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `community/donors/${id}/enroll-status`,
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
        `community/donors/${id}/complete-enroll`,
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
  DELETE_DONORS,
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

    builder
      .addCase(getDonationCount.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(getDonationCount.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.donationCount = action.payload.data ?? 0;
      })
      .addCase(
        getDonationCount.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create donor

    builder
      .addCase(createDonor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDonor.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate &&
          action.payload.navigate(`/members/${action.payload.data.id}`);
      })
      .addCase(createDonor.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update donor

    builder
      .addCase(updateDonor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDonor.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
        // action.payload.navigate && action.payload.navigate("/donors");
      })
      .addCase(updateDonor.rejected, (state, action: PayloadAction<any>) => {
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
