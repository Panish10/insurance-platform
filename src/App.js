import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
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

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    success: { main: "#2e7d32" },
    error: { main: "#d32f2f" },
    warning: { main: "#ed6c02" },
    background: { default: "#f0f2f5" },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: "#f8fafc" },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
