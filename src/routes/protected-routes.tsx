// ProtectedRoute.tsx
import Loader from "@/components/common/loader";
import { useAuth } from "@/context/auth-context";
import LoginPage from "@/pages/auth/login";
import { fetchBgs, fetchRoles } from "@/store/features/common-slice";
import { AppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, loading, user, logout } = useAuth();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  // TODO: fetch the common data here

  useEffect(() => {
    if (!isAuthenticated) {
      // dispatch(
      //   fetchCategories({
      //     params: {
      //       filters: {
      //         parent: {
      //           $null: true,
      //         },
      //       },
      //     },
      //   })
      // );

      dispatch(fetchBgs({}));
      dispatch(fetchRoles({}));

      // dispatch(fetchLevels({}));
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <Loader message="Setting Up" />
    );
  }

  if (!isAuthenticated || !user?.organizerProfile) {
    // if (isAuthenticated) {
    // TODO: change this to !isAuthenticated
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <LoginPage />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);

    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
