import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Protects any route that requires login
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Still loading from localStorage — show nothing yet
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route but user is not admin — redirect to customer dashboard
  if (adminOnly && user.role !== "ROLE_ADMIN") {
    return <Navigate to="/customer/dashboard" replace />;
  }

  // All checks passed — show the page
  return children;
};

export default PrivateRoute;
