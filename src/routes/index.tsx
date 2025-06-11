import { useRoutes } from "react-router-dom";
import DashboardLayout from "../components/layout/dashboard-layout";
import { useAuth } from "../context/auth-context";
import Page404 from "../pages/404";
import ActivityPage from "../pages/activity";
import AdminPage from "../pages/admins";
import AddAdminPage from "../pages/admins/add/add";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import LoginPage from "../pages/auth/login";
import ProfilePage from "../pages/auth/profile";
import BloodStockPage from "../pages/blood-bank/blood-stock";
import BloodUnitDetailPage from "../pages/blood-bank/blood-stock/[id]";
import AddBloodStock from "../pages/blood-bank/blood-stock/add/blood-stock";
import BloodTransfersPage from "../pages/blood-bank/transfers";
import BloodTransferDetailPage from "../pages/blood-bank/transfers/[id]";
import AddBloodTransfer from "../pages/blood-bank/transfers/add/blood-transfer-add";
import UsagePage from "../pages/blood-bank/usage-and-wastage";
import BloodRequestPage from "../pages/blood-requests";
import BloodRequestDetail from "../pages/blood-requests/[id]";
import BloodBankDashboardPage from "../pages/dashboard/bloodbank-dashboard";
import CommunityDashboardPage from "../pages/dashboard/community-dashboard";
import DonorPage from "../pages/donors";
import AddDonorPage from "../pages/donors/add/add";
import EventsPage from "../pages/events";
import EventDetailPage from "../pages/events/[id]";
import AddEventPage from "../pages/events/add/add";
import MemberPage from "../pages/followers";
import ProfileDetailPage from "../pages/profile";
import OrganizerSettingsPage from "../pages/settings";
import EnrollPage from "../pages/staffs";
import { default as AddStaffPage } from "../pages/staffs/add/add";
import GuestRoutes from "./guest-routes";
import ProtectedRoute from "./protected-routes";

export default function AppRoutes() {
  const { user } = useAuth();

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              {user?.organizerProfile?.type === "Blood Bank" ? (
                <BloodBankDashboardPage />
              ) : (
                <CommunityDashboardPage />
              )}
            </ProtectedRoute>
          ),
        },
        { path: "/staffs", element: <EnrollPage /> },
        { path: "/staffs/add", element: <AddStaffPage /> },
        {
          path: "/staffs/edit/:id",
          element: <AddStaffPage isEdit={true} />,
        },
        { path: "/admins", element: <AdminPage /> },
        { path: "/admins/add", element: <AddAdminPage /> },
        { path: "/admins/:id", element: <AddAdminPage isEdit={true} /> },
        { path: "/community/donors", element: <DonorPage /> },
        { path: "/community/donors/add", element: <AddDonorPage /> },
        { path: "/community/donors/:id", element: <ProfileDetailPage /> },
        {
          path: "/community/donors/edit/:id",
          element: <AddDonorPage isEdit={true} />,
        },
        { path: "/followers", element: <MemberPage /> },
        { path: "/activity-logs", element: <ActivityPage /> },
        { path: "/users/:id", element: <ProfileDetailPage /> },
        { path: "/community/blood-needs", element: <BloodRequestPage /> },
        {
          path: "/community/blood-needs/:id",
          element: <BloodRequestDetail />,
        },
        { path: "/community/events", element: <EventsPage /> },
        { path: "/community/events/add", element: <AddEventPage /> },
        { path: "/community/events/:id", element: <EventDetailPage /> },
        {
          path: "/community/events/edit/:id",
          element: <AddEventPage isEdit={true} />,
        },
        { path: "/blood-stocks", element: <BloodStockPage /> },
        { path: "/blood-stocks/add", element: <AddBloodStock /> },
        { path: "/blood-stocks/:id", element: <BloodUnitDetailPage /> },
        {
          path: "/blood-stocks/edit/:id",
          element: <AddBloodStock isEdit={true} />,
        },
        { path: "/blood-transfers", element: <BloodTransfersPage /> },
        { path: "/blood-transfers/add", element: <AddBloodTransfer /> },
        {
          path: "/blood-transfers/:id",
          element: <BloodTransferDetailPage />,
        },
        {
          path: "/blood-transfers/edit/:id",
          element: <AddBloodTransfer isEdit={true} />,
        },
        { path: "/usage-and-wastage", element: <UsagePage /> },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <OrganizerSettingsPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/auth/login",
      element: (
        <GuestRoutes>
          <LoginPage />
        </GuestRoutes>
      ),
    },
    {
      path: "/auth/forgot-password",
      element: <ForgotPasswordPage />,
    },
    { path: "*", element: <Page404 /> },
  ]);

  return routes;
}
