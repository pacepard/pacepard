
import React from "react";
import { Navigate } from "react-router-dom";
import storage from "@/utils/storage.util";
import { useAuthStore } from "@/stores/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated, token } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // Check multiple authentication indicators
  const hasValidToken = storage.checkToken();
  const hasUser = user && Object.keys(user).length > 0;
  const isUserAuthenticated = isAuthenticated || hasValidToken || hasUser;

  console.log('ProtectedRoute auth check:', {
    hasValidToken,
    hasUser,
    isAuthenticated,
    hasToken: !!token,
    userKeys: user ? Object.keys(user) : []
  });

  if (!isUserAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (roles && (user as any)?.userType && !roles.includes((user as any).userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;