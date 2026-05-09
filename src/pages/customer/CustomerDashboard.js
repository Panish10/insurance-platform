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
} from "@mui/material";
import {
  Policy,
  Assignment,
  CheckCircle,
  HourglassEmpty,
  MonetizationOn,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { getMyPolicies } from "../../api/policyApi";
import { getMyClaims } from "../../api/claimsApi";

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

const getClaimColor = (status) => {
  const map = {
    APPROVED: "success",
    REJECTED: "error",
    PENDING: "warning",
    UNDER_REVIEW: "info",
    PAID: "success",
  };
  return map[status] || "default";
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [myPolicies, setMyPolicies] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          getMyPolicies(),
          getMyClaims(),
        ]);
        setMyPolicies(pRes.data.data || []);
        setMyClaims(cRes.data.data || []);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activePolicies = myPolicies.filter((p) => p.status === "ACTIVE");
  const pendingClaims = myClaims.filter((c) => c.status === "PENDING");
  const approvedClaims = myClaims.filter((c) => c.status === "APPROVED");

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Welcome back, {user?.firstName}! 👋
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
            title="Total Policies"
            value={myPolicies.length}
            icon={<Policy />}
            color="#1976d2"
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
            value={myClaims.length}
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
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Approved Claims"
            value={approvedClaims.length}
            icon={<MonetizationOn />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      {/* Active Policies Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            My Active Policies
          </Typography>
          {activePolicies.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No active policies yet
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Coverage</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activePolicies.map((up) => (
                    <TableRow key={up.id} hover>
                      <TableCell>{up.policy?.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={up.policy?.policyType}
                          size="small"
                          color="info"
                        />
                      </TableCell>
                      <TableCell>₹{up.policy?.premium}/mo</TableCell>
                      <TableCell>₹{up.policy?.coverageAmount}</TableCell>
                      <TableCell>
                        {new Date(up.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip label={up.status} size="small" color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Claims
          </Typography>
          {myClaims.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No claims filed yet
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Filed On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myClaims.slice(0, 5).map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>{claim.title}</TableCell>
                      <TableCell>₹{claim.claimAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={claim.status}
                          size="small"
                          color={getClaimColor(claim.status)}
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
    </Box>
  );
};

export default CustomerDashboard;
