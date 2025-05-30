import { useAuth } from "@/context/auth-context";
import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect authenticated users
  }

  return <>{children}</>;
};

export default GuestRoute;
