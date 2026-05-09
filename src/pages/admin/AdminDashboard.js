import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
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
  Avatar,
} from "@mui/material";
import {
  People,
  Policy,
  CheckCircle,
  Assignment,
  HourglassEmpty,
} from "@mui/icons-material";
import { getAllUsers } from "../../api/authApi";
import { getAllPolicies } from "../../api/policyApi";
import { getAllClaims } from "../../api/claimsApi";

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            backgroundColor: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, pRes, cRes] = await Promise.all([
          getAllUsers(),
          getAllPolicies(),
          getAllClaims(),
        ]);
        setUsers(uRes.data.data || []);
        setPolicies(pRes.data.data || []);
        setClaims(cRes.data.data || []);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingClaims = claims.filter((c) => c.status === "PENDING");
  const activePolicies = policies.filter((p) => p.status === "ACTIVE");

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Dashboard 🔑
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Users"
            value={users.length}
            icon={<People />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Policies"
            value={policies.length}
            icon={<Policy />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Active Policies"
            value={activePolicies.length}
            icon={<CheckCircle />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Claims"
            value={claims.length}
            icon={<Assignment />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Pending Claims"
            value={pendingClaims.length}
            icon={<HourglassEmpty />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Pending Claims */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Pending Claims — Needs Review
          </Typography>
          {pendingClaims.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No pending claims — all reviewed ✅
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Filed On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingClaims.slice(0, 5).map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>#{claim.id}</TableCell>
                      <TableCell>{claim.title}</TableCell>
                      <TableCell>{claim.userId}</TableCell>
                      <TableCell>₹{claim.claimAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={claim.status}
                          size="small"
                          color="warning"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Users
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#1976d2",
                            fontSize: 12,
                          }}
                        >
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </Avatar>
                        {user.firstName} {user.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.role === "ROLE_ADMIN" ? "Admin" : "Customer"
                        }
                        size="small"
                        color={user.role === "ROLE_ADMIN" ? "error" : "info"}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.enabled ? "Active" : "Disabled"}
                        size="small"
                        color={user.enabled ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
