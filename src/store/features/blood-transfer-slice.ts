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
    totalIncomingBloodTransfersCount: 0,
    totalOutgoingBloodTransfersCount: 0
  }
};

// Constants
const FETCH_BLOODTRANSFERS = "hbb/fetchBloodTransfers";
const FETCH_BLOODTRANSFERS_META = "hbb/fetchBloodTransfersMeta";
const FETCH_SINGLE_BLOODTRANSFERS = "hbb/fetchSingleBloodTransfers";
const CREATE_BLOODTRANSFERS = "hbb/createBloodTransfers";
const UPDATE_BLOODTRANSFERS = "hbb/updateBloodTransfers";
const UPDATE_BLOODTRANSFERS_STATUS = "hbb/updateBloodTransferRequestStatus";
const DELETE_BLOODTRANSFERS = "hbb/deleteBloodTransfers";
const MARK_COMPLETE = "hbb/completeBloodPouch";

// Thunks
export const fetchBloodTransfers = createAsyncThunk(
  FETCH_BLOODTRANSFERS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("blood-pouch-requests", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunks
export const fetchBloodTransfersMeta = createAsyncThunk(
  FETCH_BLOODTRANSFERS_META,
  async ({ id }: ParamsI, { rejectWithValue }) => {
    try {
      const totalIncomingBloodTransfers = await api.get<ApiResponseI>("blood-pouch-requests", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: { toOrganizer: id }
        },
      });

      const totalOutgoingBloodTransfers = await api.get<ApiResponseI>("blood-pouch-requests", {
        params: {
          pagination: {
            pageSize: 1,
            page: 1,
          },
          filters: { fromOrganizer: id }
        },
      });
      const response = {
        totalIncomingBloodTransfersCount: totalIncomingBloodTransfers.data.meta?.pagination.total,
        totalOutgoingBloodTransfersCount: totalOutgoingBloodTransfers.data.meta?.pagination.total
      };

      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleBloodTransfers = createAsyncThunk(
  FETCH_SINGLE_BLOODTRANSFERS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`blood-pouch-requests/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBloodTransferRequest = createAsyncThunk(
  CREATE_BLOODTRANSFERS,
  async ({ data, params, navigate, actionBy }: ParamsI, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post<ApiResponseI>("blood-pouch-requests", { data }, {
        params,
      });
      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.CREATED,
            description: `Created a new blood transfer with ID: ${response.data.data?.id}`,
            modelName: "BloodPouch",
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

export const updateBloodTransferRequest = createAsyncThunk(
  UPDATE_BLOODTRANSFERS,
  async ({ data, params, id, navigate, onClose, actionBy, status, fromDetailPage = false }: ParamsI & { fromDetailPage?: boolean, status?: 'Approve' | "Reject" | 'Cancel' | 'Complete' }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `blood-pouch-requests/${id}`,
        { data },
        {
          params,
        }
      );
      status ? dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.UPDATED,
            description: `Blood Transfer Request has been set to ${status}. ID:${response.data.data.id}`,
            modelName: "BloodPouchRequest",
          },
        })
      ) : dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.UPDATED,
            description: `Blood Transfer Request has been updated with ID:${response.data.data.id}`,
            modelName: "BloodPouchRequest",
          },
        })
      );
      return { data: response.data.data, navigate, onClose, fromDetailPage };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateBloodTransferRequestStatus = createAsyncThunk(
  UPDATE_BLOODTRANSFERS_STATUS,
  async (
    { data, params, id, navigate, onClose }: ParamsI,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch<ApiResponseI>(
        `blood-pouch/${id}/enroll-status`,
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

export const deleteBloodTransferRequest = createAsyncThunk(
  DELETE_BLOODTRANSFERS,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`blood-pouch-requests/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const bloodPouchSlice = createSlice({
  name: "bloodPouch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodTransfers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBloodTransfers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchBloodTransfers.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );


    builder
      .addCase(fetchBloodTransfersMeta.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchBloodTransfersMeta.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.stats = action.payload ?? {};
      })
      .addCase(
        fetchBloodTransfersMeta.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch single bloodPouch

    builder
      .addCase(fetchSingleBloodTransfers.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleBloodTransfers.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleBloodTransfers.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create bloodPouch

    builder
      .addCase(createBloodTransferRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBloodTransferRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate("/blood-transfers");
      })
      .addCase(
        createBloodTransferRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPouch

    builder
      .addCase(updateBloodTransferRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodTransferRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.map((d) => {
            if (d.id === action.payload.data.id) {
              return {
                ...d, attributes: {
                  ...d.attributes,
                  ...action.payload.data.attributes
                }
              };
            } else {
              return d;
            }
          });
        }
        if (action.payload.fromDetailPage) {
          state.singleData = {
            ...state.singleData, // Keep existing data
            id: action.payload.data.id ?? state?.singleData?.id, // Update `id` if provided
            attributes: {
              ...state?.singleData?.attributes, // Keep existing attributes
              ...Object.fromEntries(
                Object.entries(action.payload.data.attributes || {})
                  .filter(([key]) => key in state?.singleData?.attributes)
              )
            }
          };
        }
        toast.success("Updated successfully.");
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        updateBloodTransferRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPouch status

    builder
      .addCase(updateBloodTransferRequestStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBloodTransferRequestStatus.fulfilled, (state, action) => {
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
        updateBloodTransferRequestStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update bloodPouch completion

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

    // TODO: delete bloodPouch

    builder
      .addCase(deleteBloodTransferRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBloodTransferRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        deleteBloodTransferRequest.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default bloodPouchSlice.reducer;
