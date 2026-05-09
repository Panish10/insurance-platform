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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Assignment } from "@mui/icons-material";
import { getAllClaims, updateClaimStatus } from "../../api/claimsApi";

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

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await getAllClaims();
      setClaims(res.data.data || []);
    } catch {
      setError("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (claimId, status) => {
    setUpdating(claimId + status);
    setMessage("");
    setError("");
    try {
      await updateClaimStatus(claimId, status, notes);
      setMessage(`Claim #${claimId} updated to ${status}`);
      setSelectedClaim(null);
      setNotes("");
      fetchClaims();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update claim");
    } finally {
      setUpdating(null);
    }
  };

  const filteredClaims =
    filterStatus === "ALL"
      ? claims
      : claims.filter((c) => c.status === filterStatus);

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
          Manage Claims
        </Typography>
        <Chip
          label={`${filteredClaims.length} claims`}
          color="primary"
          variant="outlined"
        />
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

      {/* Filter Buttons */}
      <ToggleButtonGroup
        value={filterStatus}
        exclusive
        onChange={(e, val) => val && setFilterStatus(val)}
        sx={{ mb: 3, flexWrap: "wrap", gap: 0.5 }}
        size="small"
      >
        {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "PAID"].map(
          (status) => (
            <ToggleButton key={status} value={status} sx={{ px: 2 }}>
              {status}
            </ToggleButton>
          ),
        )}
      </ToggleButtonGroup>

      {/* Review Dialog */}
      <Dialog
        open={Boolean(selectedClaim)}
        onClose={() => {
          setSelectedClaim(null);
          setNotes("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Review Claim #{selectedClaim?.id}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {selectedClaim?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {selectedClaim?.description}
          </Typography>
          <Typography variant="body2" mb={2}>
            <strong>Amount:</strong> ₹{selectedClaim?.claimAmount}
          </Typography>
          <TextField
            fullWidth
            label="Review Notes / Rejection Reason"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for the customer..."
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="success"
            disabled={updating === selectedClaim?.id + "APPROVED"}
            onClick={() => handleUpdateStatus(selectedClaim.id, "APPROVED")}
          >
            ✅ Approve
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0891b2",
              "&:hover": { backgroundColor: "#0e7490" },
            }}
            disabled={updating === selectedClaim?.id + "UNDER_REVIEW"}
            onClick={() => handleUpdateStatus(selectedClaim.id, "UNDER_REVIEW")}
          >
            🔍 Under Review
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={updating === selectedClaim?.id + "REJECTED"}
            onClick={() => handleUpdateStatus(selectedClaim.id, "REJECTED")}
          >
            ❌ Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={updating === selectedClaim?.id + "PAID"}
            onClick={() => handleUpdateStatus(selectedClaim.id, "PAID")}
          >
            💰 Mark Paid
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              setSelectedClaim(null);
              setNotes("");
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Claims Table */}
      <Card>
        <CardContent>
          {filteredClaims.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Assignment
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography color="text.secondary">
                No claims with status {filterStatus}
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
                    <TableCell>Policy ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Filed On</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id} hover>
                      <TableCell>#{claim.id}</TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>{claim.title}</Typography>
                      </TableCell>
                      <TableCell>{claim.userId}</TableCell>
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
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedClaim(claim);
                            setNotes("");
                          }}
                        >
                          Review
                        </Button>
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

export default AdminClaims;
