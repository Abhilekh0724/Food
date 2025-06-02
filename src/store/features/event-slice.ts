// api.ts
import api from "@/api";
import { ActionTypes } from "@/lib/enum";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";
import { createActivity } from "./activity-slice";

// ----------------------------------------------------------------------

const initialState: InitialStateI & {
  singleEvent: Record<string, any> | null;
} = {
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
  singleData: null,
  singleEvent: null,
};

// Constants
const FETCH_EVENTS = "events/fetchEvents";
const FETCH_SINGLE_EVENTS = "events/fetchSingleEvents";
const CREATE_EVENTS = "events/createEvents";
const UPDATE_EVENTS = "events/updateEvents";
const DELETE_EVENTS = "events/deleteEvents";

// Thunks
export const fetchEvents = createAsyncThunk(
  FETCH_EVENTS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("events", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleEvents = createAsyncThunk(
  FETCH_SINGLE_EVENTS,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`events/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createEvent = createAsyncThunk(
  CREATE_EVENTS,
  async ({ data, params, navigate, actionBy }: ParamsI, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post<ApiResponseI>("events", data, {
        params,
      });
      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.CREATED,
            description: `CREATED an event with ID: ${response.data.data.id}`,
            modelName: "Event",
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

export const updateEvent = createAsyncThunk(
  UPDATE_EVENTS,
  async ({ data, params, id, navigate, actionBy }: ParamsI, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `events/${id}`,
        data,
        {
          params,
        }
      );

      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.UPDATED,
            description: `UPDATED an event with ID: ${id}`,
            modelName: "Event",
          },
        })
      );

      return { data: response.data.data, navigate };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);





export const deleteEvent = createAsyncThunk(
  DELETE_EVENTS,
  async ({ id, onClose, actionBy }: ParamsI, { rejectWithValue, dispatch }) => {
    try {
      await api.delete<ApiResponseI>(`events/${id}`);
      dispatch(
        createActivity({
          data: {
            actionBy,
            action: ActionTypes.DELETED,
            description: `DELETED an event with ID: ${id}`,
            modelName: "Event",
          },
        })
      );
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const eventslice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(fetchEvents.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single course

    builder
      .addCase(fetchSingleEvents.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleEvents.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleEvent ??= {}; // Ensure `state.singleEvent` is not undefined
        state.singleEvent = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleEvents.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );


    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate &&
          action.payload.navigate(`/community/events`);
      })
      .addCase(createEvent.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update event

    builder
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
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
        // action.payload.navigate && action.payload.navigate("/events");
      })
      .addCase(updateEvent.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    builder
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteEvent.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default eventslice.reducer;
