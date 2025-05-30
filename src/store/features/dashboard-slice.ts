// api.ts
import api from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ApiResponseI, InitialStateI } from "../interface";

// ----------------------------------------------------------------------

const initialState: InitialStateI = {
  isLoading: false,
  stats: {
    staffsCount: 0,
    donorsCount: 0,
    brCount: 0,
    monthlyRequests: []
  }
};

// Constants
const DASHBAORD_STATS = "dashboard/stats";

// Thunks
export const getDashboardStats = createAsyncThunk(
  DASHBAORD_STATS,
  async ({ user, year }: any, { rejectWithValue }) => {
    try {
      const staffsResponse = await api.get<ApiResponseI>("organizer-members", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            role: "staff",
          }
        },
      });

      const donorsResponse = await api.get<ApiResponseI>("organizer-donors", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
          }
        },
      });

      const bRqsResponse = await api.get<ApiResponseI>("blood-requests", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            district: {
              $in: user?.organizerProfile?.workingDistricts
                ?.split(",")
                ?.map((district: any) => district),
            }
          }
        },
      });

      const currentYear = year;
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Fetch counts for each month
      const monthlyCounts: any = await Promise.all(
        months.map(async (month, index): Promise<any> => {
          const startDate = new Date(currentYear, index, 1).toISOString();
          const endDate = new Date(currentYear, index + 1, 0, 23, 59, 59).toISOString();

          const response = await api.get<ApiResponseI>("blood-requests", {
            params: {
              pagination: { pageSize: 1 }, // Only need count, not data
              filters: {
                createdAt: {
                  $gte: startDate,
                  $lte: endDate,
                },
              },
            },
          });

          return {
            name: month,
            total: response.data.meta?.pagination?.total ?? 0, // Fallback to 0 if undefined
          };
        })
      );

      // Result: [{ month: "Jan", count: 10 }, { month: "Feb", count: 5 }, ...]
      console.log(monthlyCounts, "count monthly");

      return {
        staffsCount: staffsResponse.data.meta?.pagination.total,
        donorsCount: donorsResponse.data.meta?.pagination.total,
        brCount: bRqsResponse.data.meta?.pagination.total,
        monthlyRequests: monthlyCounts
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(
        getDashboardStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default authSlice.reducer;
