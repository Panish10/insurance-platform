import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Policy } from "@mui/icons-material";
import { getMyPolicies } from "../../api/policyApi";

const getStatusColor = (status) => {
  const map = {
    ACTIVE: "success",
    EXPIRED: "error",
    CANCELLED: "default",
    PENDING: "warning",
  };
  return map[status] || "default";
};

const getPolicyTypeColor = (type) => {
  const map = {
    HEALTH: "#2e7d32",
    VEHICLE: "#1976d2",
    HOME: "#ed6c02",
    TRAVEL: "#9c27b0",
    LIFE: "#d32f2f",
  };
  return map[type] || "#1976d2";
};

const MyPolicies = () => {
  const [myPolicies, setMyPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyPolicies();
  }, []);

  const fetchMyPolicies = async () => {
    try {
      const res = await getMyPolicies();
      setMyPolicies(res.data.data || []);
    } catch {
      setError("Failed to load your policies");
    } finally {
      setLoading(false);
    }
  };

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
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          My Policies
        </Typography>
        <Chip
          label={`${myPolicies.length} total`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {myPolicies.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Policy sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No policies yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Go to Policies page to subscribe to a plan
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {myPolicies.map((up) => {
            const color = getPolicyTypeColor(up.policy?.policyType);
            return (
              <Grid item xs={12} sm={6} md={4} key={up.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderTop: `4px solid ${color}`,
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1.5}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ flex: 1, pr: 1 }}
                      >
                        {up.policy?.name}
                      </Typography>
                      <Chip
                        label={up.status}
                        size="small"
                        color={getStatusColor(up.status)}
                      />
                    </Box>

                    {/* Type chip */}
                    <Chip
                      label={up.policy?.policyType}
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: `${color}15`,
                        color,
                        fontWeight: 600,
                      }}
                    />

                    <Divider sx={{ mb: 2 }} />

                    {/* Details */}
                    <Box display="flex" flexDirection="column" gap={1.2}>
                      {[
                        {
                          label: "Monthly Premium",
                          value: `₹${up.policy?.premium}`,
                        },
                        {
                          label: "Coverage Amount",
                          value: `₹${up.policy?.coverageAmount}`,
                        },
                        {
                          label: "Duration",
                          value: `${up.policy?.durationMonths} months`,
                        },
                        {
                          label: "Start Date",
                          value: new Date(up.startDate).toLocaleDateString(),
                        },
                        {
                          label: "End Date",
                          value: up.endDate
                            ? new Date(up.endDate).toLocaleDateString()
                            : "N/A",
                        },
                        {
                          label: "Subscribed On",
                          value: new Date(up.subscribedAt).toLocaleDateString(),
                        },
                      ].map((item) => (
                        <Box
                          key={item.label}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            pb: 1,
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            "&:last-child": { borderBottom: "none", pb: 0 },
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyPolicies;
