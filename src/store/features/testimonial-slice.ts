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
const FETCH_TESTIMONIALS = "testimonial/fetchTestimonials";
const CREATE_TESTIMONIAL = "testimonial/createTestimonial";
const UPDATE_TESTIMONIAL = "testimonial/updateTestimonial";
const DELETE_TESTIMONIAL = "testimonial/deleteTestimonial";
const FETCH_SINGLE_TESTIMONIAL = "testimonial/fetchSingleTestimonial";

// Thunks
export const fetchTestimonials = createAsyncThunk(
  FETCH_TESTIMONIALS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("courses/testimonials", {
        params,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTestimonial = createAsyncThunk(
  CREATE_TESTIMONIAL,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        "courses/testimonials",
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

export const updateTestimonial = createAsyncThunk(
  UPDATE_TESTIMONIAL,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `courses/testimonials/${id}`,
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

export const deleteTestimonial = createAsyncThunk(
  DELETE_TESTIMONIAL,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`courses/testimonials/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const fetchSingleTestimonial = createAsyncThunk(
  FETCH_SINGLE_TESTIMONIAL,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(
        `courses/testimonials/${id}`,
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
const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchTestimonials.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create testimonial

    builder
      .addCase(createTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate && action.payload.navigate(`/testimonials`);
      })
      .addCase(
        createTestimonial.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: update testimonial

    builder
      .addCase(updateTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(
        updateTestimonial.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: delete testimonial

    builder
      .addCase(deleteTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(
        deleteTestimonial.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch single testimonial

    builder
      .addCase(fetchSingleTestimonial.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleTestimonial.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleTestimonial.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default testimonialSlice.reducer;
