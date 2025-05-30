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
const DELETE_IMAGE = "media/deleteImage";

// Thunks
export const deleteImage = createAsyncThunk(
  DELETE_IMAGE,
  async ({ id }: ParamsI, { rejectWithValue }) => {
    try {
      await api.delete<ApiResponseI>(`media/${id}`);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message?.toString() || error.message
      );
    }
  }
);

// Slice
const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   TODO: delete image
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Image deleted successfully");
      })
      .addCase(deleteImage.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        toast.error(action.payload || "Failed");
      });
  },
});

export default mediaSlice.reducer;
