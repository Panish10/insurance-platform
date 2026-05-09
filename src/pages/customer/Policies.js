import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  HealthAndSafety,
  DirectionsCar,
  Home,
  Flight,
  Favorite,
  CheckCircle,
} from "@mui/icons-material";
import { getActivePolicies, subscribeToPolicy } from "../../api/policyApi";

const getPolicyIcon = (type) => {
  const map = {
    HEALTH: <HealthAndSafety sx={{ fontSize: 40, color: "#2e7d32" }} />,
    VEHICLE: <DirectionsCar sx={{ fontSize: 40, color: "#1976d2" }} />,
    HOME: <Home sx={{ fontSize: 40, color: "#ed6c02" }} />,
    TRAVEL: <Flight sx={{ fontSize: 40, color: "#9c27b0" }} />,
    LIFE: <Favorite sx={{ fontSize: 40, color: "#d32f2f" }} />,
  };
  return map[type] || <HealthAndSafety sx={{ fontSize: 40 }} />;
};

const getPolicyColor = (type) => {
  const map = {
    HEALTH: "#2e7d32",
    VEHICLE: "#1976d2",
    HOME: "#ed6c02",
    TRAVEL: "#9c27b0",
    LIFE: "#d32f2f",
  };
  return map[type] || "#1976d2";
};

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await getActivePolicies();
      setPolicies(res.data.data || []);
    } catch {
      setError("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (policyId, policyName) => {
    setSubscribing(policyId);
    setMessage("");
    setError("");
    try {
      await subscribeToPolicy(policyId);
      setMessage(`Successfully subscribed to ${policyName}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setSubscribing(null);
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
      <Typography variant="h4" fontWeight={700} mb={3}>
        Available Policies
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {policies.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">
              No active policies available
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {policies.map((policy) => {
            const color = getPolicyColor(policy.policyType);
            return (
              <Grid item xs={12} sm={6} md={4} key={policy.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${color}30`,
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                      transition: "all 0.2s",
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    {/* Icon + Type */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          backgroundColor: `${color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getPolicyIcon(policy.policyType)}
                      </Box>
                      <Chip
                        label={policy.policyType}
                        size="small"
                        sx={{ backgroundColor: `${color}15`, color }}
                      />
                    </Box>

                    {/* Name */}
                    <Typography variant="h6" fontWeight={600} mb={0.5}>
                      {policy.name}
                    </Typography>

                    {/* Premium */}
                    <Box display="flex" alignItems="baseline" gap={0.5} mb={1}>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        ₹{policy.premium}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /month
                      </Typography>
                    </Box>

                    {policy.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={2}
                        sx={{ lineHeight: 1.6 }}
                      >
                        {policy.description}
                      </Typography>
                    )}

                    <Divider sx={{ my: 1.5 }} />

                    {/* Details */}
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Coverage
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ₹{policy.coverageAmount}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {policy.durationMonths} months
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={policy.status}
                          size="small"
                          color="success"
                        />
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Subscribe Button */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={
                        subscribing === policy.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <CheckCircle />
                        )
                      }
                      disabled={subscribing === policy.id}
                      onClick={() => handleSubscribe(policy.id, policy.name)}
                      sx={{
                        backgroundColor: color,
                        "&:hover": { backgroundColor: color, opacity: 0.9 },
                      }}
                    >
                      {subscribing === policy.id
                        ? "Subscribing..."
                        : "Subscribe Now"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Policies;
