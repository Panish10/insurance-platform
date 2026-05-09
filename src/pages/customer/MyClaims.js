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
  CircularProgress,
} from "@mui/material";
import { Add, Assignment } from "@mui/icons-material";
import { getMyClaims, submitClaim } from "../../api/claimsApi";

const getStatusColor = (status) => {
  const map = {
    PENDING: "warning",
    UNDER_REVIEW: "info",
    APPROVED: "success",
    REJECTED: "error",
    PAID: "success",
  };
  return map[status] || "default";
};

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    policyId: "",
    title: "",
    description: "",
    claimAmount: "",
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await getMyClaims();
      setClaims(res.data.data || []);
    } catch {
      setError("Failed to load claims");
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
      await submitClaim({
        ...formData,
        policyId: parseInt(formData.policyId),
        claimAmount: parseFloat(formData.claimAmount),
      });
      setMessage("Claim submitted successfully!");
      setShowForm(false);
      setFormData({
        policyId: "",
        title: "",
        description: "",
        claimAmount: "",
      });
      fetchClaims();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim");
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
          My Claims
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
        >
          File New Claim
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

      {/* Submit Claim Dialog */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>File a New Claim</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Policy ID"
              name="policyId"
              type="number"
              value={formData.policyId}
              onChange={handleChange}
              placeholder="Enter your policy ID"
              required
              fullWidth
            />
            <TextField
              label="Claim Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Hospital admission claim"
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your claim in detail..."
              required
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Claim Amount (₹)"
              name="claimAmount"
              type="number"
              value={formData.claimAmount}
              onChange={handleChange}
              placeholder="e.g. 5000"
              required
              fullWidth
            />
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
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {submitting ? "Submitting..." : "Submit Claim"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Claims Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Claims History
          </Typography>
          {claims.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Assignment
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No claims filed yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "File New Claim" to submit your first claim
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Policy ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Filed On</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>#{claim.id}</TableCell>
                      <TableCell>{claim.title}</TableCell>
                      <TableCell>{claim.policyId}</TableCell>
                      <TableCell>₹{claim.claimAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={claim.status}
                          size="small"
                          color={getStatusColor(claim.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>
                        {claim.rejectionReason || claim.reviewNotes || "-"}
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

export default MyClaims;
