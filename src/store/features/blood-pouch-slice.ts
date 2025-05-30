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
  stats: {
    totalAvailableBloodPouches: 0,
    totalBloodPouchesUsed: 0,
    totalBloodPouchesWasted: 0,
    totalExpiringBloodPouches: 0,
  }
};

// Constants
const FETCH_BLOODREQUESTS = "hbb/fetchBloodPouches";
const FETCH_STATS_BLOOD_POUCH = "hbb/fetchBloodPouchStats";
const FETCH_SINGLE_BLOODREQUESTS = "hbb/fetchSingleBloodPouches";
const CREATE_BLOODREQUESTS = "hbb/createBloodPouches";
const UPDATE_BLOODREQUESTS = "hbb/updateBloodPouches";
const UPDATE_BLOODREQUESTS_STATUS = "hbb/updateBloodPouchStatus";
const DELETE_BLOODREQUESTS = "hbb/deleteBloodPouches";
const MARK_COMPLETE = "hbb/completeBloodPouch";

// Thunks
export const fetchBloodPouches = createAsyncThunk(
  FETCH_BLOODREQUESTS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("blood-pouches", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunks
export const fetchBloodPouchStats = createAsyncThunk(
  FETCH_STATS_BLOOD_POUCH,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const totalAvailableBloodPouches = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: {
            organizer: {
              id
            },
            isUsed: false,
            isWasted: false,
            bloodPouchRequests: {
              $or: [
                {
                  id: { $null: true }
                },
                {
                  $and: [{
                    requestType: 'Transfer'
                  },
                  {
                    status: {
                      $ne: 'Approve',
                    }
                  }]
                }
              ],
            }
          }
        },
      });

      const totalBloodPouchesUsed = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: {
            isUsed: true,
            organizer: {
              id
            }
          }
        },
      });

      const totalBloodPouchesWasted = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: {
            isWasted: true
          }
        },
      });

      const totalExpiringBloodPouches = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: {
            isUsed: false,
            isWasted: false,
            expiry: {
              $gt: new Date(), // Not expired yet
              $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expires within 7 days
            },
            organizer: {
              id
            }
          }
        },
      });

      const response = {
        totalAvailableBloodPouches: totalAvailableBloodPouches.data.meta?.pagination.total,
        totalBloodPouchesUsed: totalBloodPouchesUsed.data.meta?.pagination.total,
        totalBloodPouchesWasted: totalBloodPouchesWasted.data.meta?.pagination.total,
        totalExpiringBloodPouches: totalExpiringBloodPouches.data.meta?.pagination.total,
      };

      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleBloodPouches = createAsyncThunk(
  FETCH_SINGLE_BLOODREQUESTS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`blood-pouches/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBloodPouch = createAsyncThunk(
  CREATE_BLOODREQUESTS,
  async ({ data, params, navigate, actionBy }: ParamsI, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post<ApiResponseI>("blood-pouches", { data }, {
        params,
      });

      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.CREATED,
            description: `Created a new blood transfer request is made`,
            modelName: "BloodPouchRequest",
          },
        })
      );

      return { data: response.data.data, navigate };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateBloodPouch = createAsyncThunk(
  UPDATE_BLOODREQUESTS,
  async ({ data, params, id, navigate, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `blood-pouches/${id}`,
        { data },
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

export const updateBloodPouchStatus = createAsyncThunk(
  UPDATE_BLOODREQUESTS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `blood-pouches/${id}/enroll-status`,
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
        `blood-pouches/${id}/complete-enroll`,
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

export const deleteBloodPoucht = createAsyncThunk(
  DELETE_BLOODREQUESTS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`blood-pouches/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const bloodPouchtSlice = createSlice({
  name: "bloodPoucht",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodPouches.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBloodPouches.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchBloodPouches.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    builder
      .addCase(fetchBloodPouchStats.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBloodPouchStats.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.stats = action.payload ?? {};
      })
      .addCase(
        fetchBloodPouchStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch single bloodPoucht

    builder
      .addCase(fetchSingleBloodPouches.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleBloodPouches.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleBloodPouches.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create bloodPoucht

    builder
      .addCase(createBloodPouch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBloodPouch.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate("/blood-stocks");
      })
      .addCase(
        createBloodPouch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPoucht

    builder
      .addCase(updateBloodPouch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodPouch.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.map((d) => {
            if (d.id === action.payload.data.id) {
              devLog(action.payload.data, "hello")
              return { ...d, attributes: { ...d.attributes, ...action.payload.data.attributes } };
            } else {
              return d;
            }
          });
        }
        toast.success("Updated successfully.");
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        updateBloodPouch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPoucht status

    builder
      .addCase(updateBloodPouchStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodPouchStatus.fulfilled, (state, action) => {
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
        updateBloodPouchStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPoucht completion

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

    // TODO: delete bloodPoucht

    builder
      .addCase(deleteBloodPoucht.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBloodPoucht.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        deleteBloodPoucht.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default bloodPouchtSlice.reducer;
