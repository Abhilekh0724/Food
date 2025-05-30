// api.ts
import api from "@/api";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI = {
  isLoading: false,
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
const FETCH_SUCCESS_STORIES = "success_story/fetchSuccessStories";
const CREATE_SUCCESS_STORY = "success_story/createSuccessStory";
const UPDATE_SUCCESS_STORY = "success_story/updateSuccessStory";
const DELETE_SUCCESS_STORY = "success_story/deleteSuccessStory";
const FETCH_SINGLE_SUCCESS_STORY = "success_story/fetchSingleSuccessStory";

// Thunks
export const fetchSuccessStories = createAsyncThunk(
  FETCH_SUCCESS_STORIES,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("courses/success-stories", {
        params,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createSuccessStory = createAsyncThunk(
  CREATE_SUCCESS_STORY,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        "courses/success-stories",
        data,
        {
          params,
        }
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

export const updateSuccessStory = createAsyncThunk(
  UPDATE_SUCCESS_STORY,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `courses/success-stories/${id}`,
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

export const deleteSuccessStory = createAsyncThunk(
  DELETE_SUCCESS_STORY,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`courses/success-stories/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const fetchSingleSuccessStory = createAsyncThunk(
  FETCH_SINGLE_SUCCESS_STORY,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(
        `courses/success-stories/${id}`,
        {
          params,
        }
      );
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const success_storieslice = createSlice({
  name: "success_story",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(fetchSuccessStories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuccessStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchSuccessStories.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create success_story

    builder
      .addCase(createSuccessStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSuccessStory.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate(`/success-stories`);
      })
      .addCase(
        createSuccessStory.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update success_story

    builder
      .addCase(updateSuccessStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSuccessStory.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(
        updateSuccessStory.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: delete success_story

    builder
      .addCase(deleteSuccessStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSuccessStory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        deleteSuccessStory.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch single success_story

    builder
      .addCase(fetchSingleSuccessStory.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleSuccessStory.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleSuccessStory.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default success_storieslice.reducer;
