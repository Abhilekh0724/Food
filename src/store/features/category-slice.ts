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
const FETCH_CATEGORIES = "category/fetchCategories";
const CREATE_CATEGORY = "category/createCategory";
const UPDATE_CATEGORY = "category/updateCategory";
const DELETE_CATEGORY = "category/deleteCategory";
const FETCH_SINGLE_CATEGORY = "category/fetchSingleCategory";

// Thunks
export const fetchCategories = createAsyncThunk(
  FETCH_CATEGORIES,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(
        "courses/course-categories",
        {
          params,
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  CREATE_CATEGORY,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        "courses/course-categories",
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

export const updateCategory = createAsyncThunk(
  UPDATE_CATEGORY,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `courses/course-categories/${id}`,
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

export const deleteCategory = createAsyncThunk(
  DELETE_CATEGORY,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`courses/course-categories/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const fetchSingleCategory = createAsyncThunk(
  FETCH_SINGLE_CATEGORY,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(
        `courses/course-categories/${id}`,
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
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: create category

    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate &&
          action.payload.navigate(`/course-categories`);
      })
      .addCase(createCategory.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update category

    builder
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(updateCategory.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: delete category

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteCategory.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single category

    builder
      .addCase(fetchSingleCategory.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleCategory.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleCategory.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default categorySlice.reducer;
