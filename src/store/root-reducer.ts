import { combineReducers } from "redux";
// slices
import activitySlice from "./features/activity-slice";
import adminSlice from "./features/admin-slice";
import authSlice from "./features/auth-slice";
import bloodRequestSlice from "./features/blood-request-slice";
import categorySlice from "./features/category-slice";
import commonSlice from "./features/common-slice";
import courseSlice from "./features/course-slice";
import dashboardSlice from "./features/dashboard-slice";
import donorSlice from "./features/donor-slice";
import followerSlice from "./features/follower-slice";
import levelSlice from "./features/level-slice";
import mediaSlice from "./features/media-slice";
import staffSlice from "./features/staff-slice";
import successStorySlice from "./features/success-stories-slice";
import testimonialSlice from "./features/testimonial-slice";
import bloodPouchSlice from "./features/blood-pouch-slice";
import organizerSlice from "./features/organizer-slice";
import bloodTransferSlice from "./features/blood-transfer-slice";

// ----------------------------------------------------------------------

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  category: categorySlice,
  level: levelSlice,
  admin: adminSlice,
  donor: donorSlice,
  staff: staffSlice,
  course: courseSlice,
  media: mediaSlice,
  testimonial: testimonialSlice,
  successStory: successStorySlice,
  dashboard: dashboardSlice,
  follower: followerSlice,
  bloodRequest: bloodRequestSlice,
  common: commonSlice,
  activity: activitySlice,
  bloodPouch: bloodPouchSlice,
  organizer: organizerSlice,
  bloodTransfer: bloodTransferSlice,
});

// Infer the `RootState` type from the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
