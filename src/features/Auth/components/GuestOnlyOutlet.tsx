import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

type GuestOnlyOutletProps = {
  fallbackPath?: string;
};

const DEFAULT_REDIRECT_PATH = "/user";

const GuestOnlyOutlet: React.FC<GuestOnlyOutletProps> = ({
  fallbackPath = DEFAULT_REDIRECT_PATH,
}) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default GuestOnlyOutlet;
