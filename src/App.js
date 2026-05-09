import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/common/Navbar";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Policies from "./pages/customer/Policies";
import MyPolicies from "./pages/customer/MyPolicies";
import MyClaims from "./pages/customer/MyClaims";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminUsers from "./pages/admin/AdminUsers";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/policies"
          element={
            <PrivateRoute>
              <Policies />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/my-policies"
          element={
            <PrivateRoute>
              <MyPolicies />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/claims"
          element={
            <PrivateRoute>
              <MyClaims />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/policies"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminPolicies />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminClaims />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
