// api.ts
import api from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI, ParamsI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI = {
  isLoading: false,
};

// Constants
const CHANGE_PASSWORD = "auth/changePassword";
const FORGOT_PASSWORD = "auth/forgotPassword";
const UPDATE_ME = "auth/updateMe";
const UPDATE_ORGANIZER_PROFILE = "auth/updateOrganizerProfile";

// Thunks
export const changePassword = createAsyncThunk(
  CHANGE_PASSWORD,
  async ({ data, closeModal, logout }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        "auth/change-password",
        data
      );
      closeModal && closeModal();
      logout && logout();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  FORGOT_PASSWORD,
  async ({ data }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponseI>(
        "auth/forgot-password",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "error");
    }
  }
);

export const updateMe = createAsyncThunk(
  UPDATE_ME,
  async (
    { data, updateMe, id }: ParamsI & { updateMe: (data: any) => void },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponseI>(`users/${id}`, data);
      updateMe && updateMe(response.data.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "error");
    }
  }
);

export const updateOrganizerProfile = createAsyncThunk(
  UPDATE_ORGANIZER_PROFILE,
  async ({ data, id }: ParamsI, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponseI>(
        `organizer-profiles/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || "error");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Password changed successfully");
      })
      .addCase(changePassword.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed to change password");
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Password reset link has been sent to your email.");
      })
      .addCase(forgotPassword.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed to send password reset link");
      })

      // update Me
      .addCase(updateMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMe.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Updated successfully");
      })
      .addCase(updateMe.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed to update");
      })

      // update organizerProfile
      .addCase(updateOrganizerProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrganizerProfile.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Updated successfully");
      })
      .addCase(
        updateOrganizerProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed to update");
        }
      );
  },
});

export default authSlice.reducer;
