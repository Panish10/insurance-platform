import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  TextField,
  Avatar,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import { Search, People } from "@mui/icons-material";
import { getAllUsers } from "../../api/authApi";

const getRoleColor = (role) => {
  const map = {
    ROLE_ADMIN: "error",
    ROLE_CUSTOMER: "info",
    ROLE_AGENT: "warning",
  };
  return map[role] || "default";
};

const getRoleLabel = (role) => {
  const map = {
    ROLE_ADMIN: "Admin",
    ROLE_CUSTOMER: "Customer",
    ROLE_AGENT: "Agent",
  };
  return map[role] || role;
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash).toString(16).padStart(6, "0").slice(0, 6);
  return `#${color}`;
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Manage Users
        </Typography>
        <Chip
          label={`${filteredUsers.length} users`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, width: "100%", maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Role Filter */}
      <ToggleButtonGroup
        value={filterRole}
        exclusive
        onChange={(e, val) => val && setFilterRole(val)}
        sx={{ mb: 3 }}
        size="small"
      >
        <ToggleButton value="ALL">All</ToggleButton>
        <ToggleButton value="ROLE_CUSTOMER">Customers</ToggleButton>
        <ToggleButton value="ROLE_ADMIN">Admins</ToggleButton>
        <ToggleButton value="ROLE_AGENT">Agents</ToggleButton>
      </ToggleButtonGroup>

      {/* Users Table */}
      <Card>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <Box textAlign="center" py={6}>
              <People sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary">No users found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search or filter
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`;
                    const avatarColor = stringToColor(fullName);
                    return (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: avatarColor,
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {fullName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                #{user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleLabel(user.role)}
                            size="small"
                            color={getRoleColor(user.role)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.enabled ? "Active" : "Disabled"}
                            size="small"
                            color={user.enabled ? "success" : "error"}
                            variant={user.enabled ? "filled" : "outlined"}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminUsers;
