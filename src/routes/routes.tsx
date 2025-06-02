// routes.tsx
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import CommunityDashboardPage from "@/pages/dashboard/community-dashboard";
import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./protected-routes";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/auth/login",
      element: <LoginPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <CommunityDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <div>404 Not Found</div>,
    },
  ]);

  return routes;
};

export default AppRoutes;
