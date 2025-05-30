// routes.tsx
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";
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
          <DashboardPage />
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
