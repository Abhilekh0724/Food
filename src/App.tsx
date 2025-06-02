import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/dashboard-layout";
import { ThemeProvider } from "./components/theme/theme-provider";
import { AuthProvider } from "./context/auth-context";
import Page404 from "./pages/404";
import ActivityPage from "./pages/activity";
import AdminPage from "./pages/admins";
import AddAdminPage from "./pages/admins/add/add";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import LoginPage from "./pages/auth/login";
import ProfilePage from "./pages/auth/profile";
import BloodStockPage from "./pages/blood-bank/blood-stock";
import AddBloodStock from "./pages/blood-bank/blood-stock/add/blood-stock";
import BloodUnitDetailPage from "./pages/blood-bank/blood-stock/[id]";
import BloodTransfersPage from "./pages/blood-bank/transfers";
import AddBloodTransfer from "./pages/blood-bank/transfers/add/blood-transfer-add";
import BloodTransferDetailPage from "./pages/blood-bank/transfers/[id]";
import UsagePage from "./pages/blood-bank/usage-and-wastage";
import BloodRequestPage from "./pages/blood-requests";
import BloodRequestDetail from "./pages/blood-requests/[id]";
import CategoriesPage from "./pages/categories";
import AddCategoryPage from "./pages/categories/add/add";
import DashboardPage from "./pages/dashboard";
import DonorPage from "./pages/donors";
import AddDonorPage from "./pages/donors/add/add";
import EventsPage from "./pages/events";
import AddEventPage from "./pages/events/add/add";
import EventDetailPage from "./pages/events/[id]";
import MemberPage from "./pages/followers";
import ProfileDetailPage from "./pages/profile";
import OrganizerSettingsPage from "./pages/settings";
import EnrollPage from "./pages/staffs";
import { default as AddStaffPage } from "./pages/staffs/add/add";
import GuestRoutes from "./routes/guest-routes";
import ProtectedRoute from "./routes/protected-routes";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/staffs" element={<EnrollPage />} />
              <Route path="/staffs/add" element={<AddStaffPage />} />
              <Route
                path="/staffs/edit/:id"
                element={<AddStaffPage isEdit={true} />}
              />

              <Route path="/admins" element={<AdminPage />} />
              <Route path="/admins/add" element={<AddAdminPage />} />

              <Route
                path="/admins/:id"
                element={<AddAdminPage isEdit={true} />}
              />

              <Route path="/donors" element={<DonorPage />} />
              <Route path="/donors/add" element={<AddDonorPage />} />
              <Route path="/donors/:id" element={<ProfileDetailPage />} />
              <Route
                path="/donors/edit/:id"
                element={<AddDonorPage isEdit={true} />}
              />

              <Route path="/followers" element={<MemberPage />} />

              <Route path="/activity-logs" element={<ActivityPage />} />

              <Route path="/users/:id" element={<ProfileDetailPage />} />



              <Route path="/blood-requests" element={<BloodRequestPage />} />

              <Route
                path="/blood-requests/:id"
                element={<BloodRequestDetail />}
              />

              <Route path="/community/events" element={<EventsPage />} />
              <Route path="/community/events/add" element={<AddEventPage />} />

              <Route
                path="/community/events/:id"
                element={<EventDetailPage />}
              />

              <Route
                path="/community/events/edit/:id"
                element={<AddEventPage isEdit={true} />}
              />

              {/* TODO: blood bank */}

              <Route path="/blood-stocks" element={<BloodStockPage />} />
              <Route path="/blood-stocks/add" element={<AddBloodStock />} />
              <Route path="/blood-stocks/:id" element={<BloodUnitDetailPage />} />
              <Route path="/blood-stocks/edit/:id" element={<AddBloodStock isEdit={true} />} />

              <Route path="/blood-transfers" element={<BloodTransfersPage />} />
              <Route path="/blood-transfers/add" element={<AddBloodTransfer />} />
              <Route path="/blood-transfers/:id" element={<BloodTransferDetailPage />} />
              <Route path="/blood-transfers/edit/:id" element={<AddBloodTransfer isEdit={true} />} />

              <Route path="/usage-and-wastage" element={<UsagePage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <OrganizerSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="/auth/login"
              element={
                <GuestRoutes>
                  <LoginPage />
                </GuestRoutes>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordPage />}
            />

            <Route path="*" element={<Page404 />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
