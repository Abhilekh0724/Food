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
  },
  bloodBankStats: [
    { type: "A+", count: 0, color: "bg-red-500" },
    { type: "A-", count: 0, color: "bg-red-400" },
    { type: "B+", count: 0, color: "bg-red-500" },
    { type: "B-", count: 0, color: "bg-red-400" },
    { type: "AB+", count: 0, color: "bg-red-500" },
    { type: "AB-", count: 0, color: "bg-red-400" },
    { type: "O+", count: 0, color: "bg-red-500" },
    { type: "O-", count: 0, color: "bg-red-400" },
  ]
}
// Constants
const COMMUNITY_DASHBAORD_STATS = "communityDashboard/stats";
const BLOODBANK_DASHBAORD_STATS = "bloodBankDashboard/stats";

// Thunks
export const getCommunityDashboardStats = createAsyncThunk(
  COMMUNITY_DASHBAORD_STATS,
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

export const getBloodBankDashboardStats = createAsyncThunk(
  BLOODBANK_DASHBAORD_STATS,
  async ({ user }: any, { rejectWithValue }) => {
    try {
      const APlusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "A+"
            },
            $or: [{
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
            }]
          }
        },
      });


      const BPlusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "B+"
            },
            $or: [{
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
            }]
          }
        },
      });

      const ABPlusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "AB+"
            },
            $or: [{
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
            }]
          }
        },
      });

      const AMinusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "A-"
            },
            $or: [{
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
            }]
          }
        },
      });

      const BMinusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "B-"
            },
            $or: [{
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
            }]
          }
        },
      });

      const ABMinusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "AB-"
            },
            $or: [{
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
            }]
          }
        },
      });

      const OPlusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "O+"
            },
            $or: [{
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
            }]
          }
        },
      });

      const OMinusBGResponse = await api.get<ApiResponseI>("blood-pouches", {
        params: {
          pagination: {
            page: 1,
            pageSize: 1,
          },
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
            bloodGroup: {
              name: "O-"
            },
            $or: [{
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
            }]
          }
        },
      });

      return [
        { type: "A+", count: APlusBGResponse.data.meta?.pagination.total, color: "bg-red-500" },
        { type: "A-", count: AMinusBGResponse.data.meta?.pagination.total, color: "bg-red-400" },
        { type: "B+", count: BPlusBGResponse.data.meta?.pagination.total, color: "bg-red-500" },
        { type: "B-", count: BMinusBGResponse.data.meta?.pagination.total, color: "bg-red-400" },
        { type: "AB+", count: ABPlusBGResponse.data.meta?.pagination.total, color: "bg-red-500" },
        { type: "AB-", count: ABMinusBGResponse.data.meta?.pagination.total, color: "bg-red-400" },
        { type: "O+", count: OPlusBGResponse.data.meta?.pagination.total, color: "bg-red-500" },
        { type: "O-", count: OMinusBGResponse.data.meta?.pagination.total, color: "bg-red-400" },
      ]
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
      .addCase(getCommunityDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCommunityDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(
        getCommunityDashboardStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      )

      .addCase(getBloodBankDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBloodBankDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodBankStats = action.payload;
      })
      .addCase(
        getBloodBankDashboardStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          toast.error(action.payload || "Failed");
        }
      );
  },
});

export default authSlice.reducer;
