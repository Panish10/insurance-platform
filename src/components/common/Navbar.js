import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  Shield,
  KeyboardArrowDown,
  Logout,
  Dashboard,
  Policy,
  Assignment,
  People,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const customerLinks = [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    {
      label: "Policies",
      path: "/customer/policies",
      icon: <Policy fontSize="small" />,
    },
    {
      label: "My Policies",
      path: "/customer/my-policies",
      icon: <Assignment fontSize="small" />,
    },
    {
      label: "My Claims",
      path: "/customer/claims",
      icon: <Assignment fontSize="small" />,
    },
  ];

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <Dashboard fontSize="small" />,
    },
    {
      label: "Policies",
      path: "/admin/policies",
      icon: <Policy fontSize="small" />,
    },
    {
      label: "Claims",
      path: "/admin/claims",
      icon: <Assignment fontSize="small" />,
    },
    { label: "Users", path: "/admin/users", icon: <People fontSize="small" /> },
  ];

  const links = isAdmin() ? adminLinks : customerLinks;

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1e293b" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1}>
          <Shield sx={{ color: "#60a5fa" }} />
          <Typography
            variant="h6"
            sx={{ color: "#60a5fa", fontWeight: 700, letterSpacing: 0.5 }}
          >
            InsuranceApp
          </Typography>
        </Box>

        {/* Nav Links */}
        {user && (
          <Box display="flex" gap={0.5}>
            {links.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                startIcon={link.icon}
                sx={{
                  color: "#cbd5e1",
                  "&:hover": { backgroundColor: "#334155", color: "white" },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* User Section */}
        {user && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              label={isAdmin() ? "Admin" : "Customer"}
              size="small"
              color={isAdmin() ? "error" : "primary"}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            />

            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ cursor: "pointer" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#2563eb",
                  fontSize: "14px",
                }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </Avatar>
              <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                {user.firstName}
              </Typography>
              <KeyboardArrowDown sx={{ color: "#94a3b8", fontSize: 18 }} />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ color: "error.main", gap: 1 }}
              >
                <Logout fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
