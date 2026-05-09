import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Add, Policy } from "@mui/icons-material";
import { getAllPolicies, createPolicy } from "../../api/policyApi";

const POLICY_TYPES = ["HEALTH", "LIFE", "VEHICLE", "HOME", "TRAVEL"];

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    policyType: "HEALTH",
    premium: "",
    coverageAmount: "",
    durationMonths: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await getAllPolicies();
      setPolicies(res.data.data || []);
    } catch {
      setError("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      await createPolicy({
        ...formData,
        premium: parseFloat(formData.premium),
        coverageAmount: parseFloat(formData.coverageAmount),
        durationMonths: parseInt(formData.durationMonths),
      });
      setMessage("Policy created successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        description: "",
        policyType: "HEALTH",
        premium: "",
        coverageAmount: "",
        durationMonths: "",
      });
      fetchPolicies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create policy");
    } finally {
      setSubmitting(false);
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
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Manage Policies
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
        >
          Create Policy
        </Button>
      </Box>

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

      {/* Create Policy Dialog */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Policy</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Policy Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Basic Health Plan"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Policy Type"
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  required
                >
                  {POLICY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Monthly Premium (₹)"
                  name="premium"
                  type="number"
                  value={formData.premium}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coverage Amount (₹)"
                  name="coverageAmount"
                  type="number"
                  value={formData.coverageAmount}
                  onChange={handleChange}
                  placeholder="e.g. 100000"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Duration (months)"
                  name="durationMonths"
                  type="number"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this policy..."
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
            <Button
              onClick={() => setShowForm(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {submitting ? "Creating..." : "Create Policy"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Policies Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            All Policies ({policies.length})
          </Typography>
          {policies.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Policy sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary">No policies yet</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Coverage</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id} hover>
                      <TableCell>#{policy.id}</TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>{policy.name}</Typography>
                        {policy.description && (
                          <Typography variant="caption" color="text.secondary">
                            {policy.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={policy.policyType}
                          size="small"
                          color="info"
                        />
                      </TableCell>
                      <TableCell>₹{policy.premium}/mo</TableCell>
                      <TableCell>₹{policy.coverageAmount}</TableCell>
                      <TableCell>{policy.durationMonths} months</TableCell>
                      <TableCell>
                        <Chip
                          label={policy.status}
                          size="small"
                          color={
                            policy.status === "ACTIVE" ? "success" : "error"
                          }
                        />
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

export default AdminPolicies;
