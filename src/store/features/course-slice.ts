// api.ts
import api from "@/api";
import { devLog } from "@/util/logger";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI & {
  singleCourse: Record<string, any> | null;
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
  singleCourse: null,
};

// Constants
const FETCH_COURSES = "courses/fetchCourses";
const FETCH_SINGLE_COURSES = "courses/fetchSingleCourses";
const FETCH_SINGLE_COURSES_OVERVIEW = "courses/fetchOverview";
const FETCH_SINGLE_COURSES_SYLLABUS = "courses/fetchSyllabus";
const FETCH_SINGLE_COURSES_FAQ = "courses/fetchFaq";
const FETCH_SINGLE_COURSES_TIMINGS = "courses/fetchTimings";
const CREATE_COURSES = "courses/createCourses";
const CREATE_COURSES_TIMINGS = "courses/createCourseTiming";
const CREATE_COURSES_OVERVIEW = "courses/createCourseOverview";
const UPDATE_COURSES_OVERVIEW = "courses/updateCourseOverview";
const UPDATE_COURSES_TIMING = "courses/updateCourseTiming";
const UPDATE_COURSES = "courses/updateCourses";
const CREATE_SYLLABUS = "courses/createSyllabus";
const UPDATE_SYLLABUS = "courses/updateSyllabus";
const CREATE_FAQ = "courses/createFaq";
const UPDATE_FAQ = "courses/updateFaq";
const DELETE_COURSES = "courses/deleteCourses";

// Thunks
export const fetchCourses = createAsyncThunk(
  FETCH_COURSES,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>("courses/courses", {
        params,
      });
      return { data: response.data.data, meta: response.data.meta };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleCourses = createAsyncThunk(
  FETCH_SINGLE_COURSES,
  async ({ params, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`courses/courses/${id}`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOverview = createAsyncThunk(
  FETCH_SINGLE_COURSES_OVERVIEW,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`courses/course-overview`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSyllabus = createAsyncThunk(
  FETCH_SINGLE_COURSES_SYLLABUS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`courses/syllabus`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFaq = createAsyncThunk(
  FETCH_SINGLE_COURSES_FAQ,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`courses/faqs`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTimings = createAsyncThunk(
  FETCH_SINGLE_COURSES_TIMINGS,
  async ({ params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponseI>(`courses/timings`, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createOverview = createAsyncThunk(
  CREATE_COURSES_OVERVIEW,
  async ({ params, data }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        `courses/course-overview`,
        data,
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

export const createTiming = createAsyncThunk(
  CREATE_COURSES_TIMINGS,
  async ({ params, data }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(`courses/timings`, data, {
        params,
      });
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOverview = createAsyncThunk(
  UPDATE_COURSES_OVERVIEW,
  async ({ params, data, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `courses/course-overview/${id}`,
        data,
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

export const createCourse = createAsyncThunk(
  CREATE_COURSES,
  async ({ data, params, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>("courses/courses", data, {
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

export const updateCourse = createAsyncThunk(
  UPDATE_COURSES,
  async ({ data, params, id, navigate }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `courses/courses/${id}`,
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

export const createSyllabus = createAsyncThunk(
  CREATE_SYLLABUS,
  async ({ data, params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>("courses/syllabus", data, {
        params,
      });

      return { data: response.data.data };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateSyllabus = createAsyncThunk(
  UPDATE_SYLLABUS,
  async ({ data, params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        "courses/syllabus/bulk-update",
        data,
        {
          params,
        }
      );

      return { data: response.data.data };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const createFaq = createAsyncThunk(
  CREATE_FAQ,
  async ({ data, params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>("courses/faqs", data, {
        params,
      });

      return { data: response.data.data };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateFaq = createAsyncThunk(
  UPDATE_FAQ,
  async ({ data, params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        "courses/faqs/bulk-update",
        data,
        {
          params,
        }
      );

      return { data: response.data.data };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const updateTiming = createAsyncThunk(
  UPDATE_COURSES_TIMING,
  async ({ data, params }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        "courses/timings/bulk-update",
        data,
        {
          params,
        }
      );

      return { data: response.data.data };
    } catch (error: any) {
      devLog(error, "error");
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  DELETE_COURSES,
  async ({ id, onClose }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`courses/courses/${id}`);
      return { id, onClose };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const courseslice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.data ??= {}; // Ensure `state.data` is not undefined
        state.data = action.payload ?? [];
      })
      .addCase(fetchCourses.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch single course

    builder
      .addCase(fetchSingleCourses.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchSingleCourses.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleCourse ??= {}; // Ensure `state.singleCourse` is not undefined
        state.singleCourse = action.payload.data ?? [];
      })
      .addCase(
        fetchSingleCourses.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          toast.error(action.payload || "Failed");
        }
      );

    // TODO: fetch overview

    builder
      .addCase(fetchOverview.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.singleData = action.payload.data[0] ?? null;
      })
      .addCase(fetchOverview.rejected, (state, action: PayloadAction<any>) => {
        state.fetchLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: create course

    builder
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.navigate &&
          action.payload.navigate(`/courses/${action.payload.data.id}`);
      })
      .addCase(createCourse.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: create syllabus

    builder
      .addCase(createSyllabus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSyllabus.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(createSyllabus.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: create faq

    builder
      .addCase(createFaq.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(createFaq.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update syllabus

    builder
      .addCase(updateSyllabus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSyllabus.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(updateSyllabus.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update faq

    builder
      .addCase(updateFaq.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(updateFaq.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: create timing

    builder
      .addCase(createTiming.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTiming.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(createTiming.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update timing

    builder
      .addCase(updateTiming.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTiming.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
      })
      .addCase(updateTiming.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch syllabus

    builder
      .addCase(fetchSyllabus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleData = action.payload.data ?? null;
      })
      .addCase(fetchSyllabus.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch faq

    builder
      .addCase(fetchFaq.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFaq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleData = action.payload.data ?? null;
      })
      .addCase(fetchFaq.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: fetch timings

    builder
      .addCase(fetchTimings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTimings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleData = action.payload.data ?? null;
      })
      .addCase(fetchTimings.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update course

    builder
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
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
        // action.payload.navigate && action.payload.navigate("/courses");
      })
      .addCase(updateCourse.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: create overview

    builder
      .addCase(createOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Created successfully.");
        state.singleData ??= {}; // Ensure `state.singleData` is not undefined
        state.singleData = action.payload.data ?? [];
      })
      .addCase(createOverview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: update overview

    builder
      .addCase(updateOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success("Updated successfully.");
        // action.payload.navigate && action.payload.navigate("/courses");
      })
      .addCase(updateOverview.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });

    // TODO: delete course

    builder
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data && state.data.data) {
          state.data.data = state.data.data.filter(
            (d) => d?.id !== action.payload.id
          );
        }
        action.payload.onClose && action.payload.onClose();
      })
      .addCase(deleteCourse.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default courseslice.reducer;
