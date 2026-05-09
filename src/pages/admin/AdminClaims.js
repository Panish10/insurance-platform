import React, { useState, useEffect } from "react";
import { getAllClaims, updateClaimStatus } from "../../api/claimsApi";

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
    } catch (err) {
      setError("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (claimId, status) => {
    setUpdating(claimId);
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

  const getStatusBadge = (status) => {
    const map = {
      PENDING: "badge-warning",
      UNDER_REVIEW: "badge-info",
      APPROVED: "badge-success",
      REJECTED: "badge-danger",
      PAID: "badge-success",
    };
    return map[status] || "badge-gray";
  };

  const filteredClaims =
    filterStatus === "ALL"
      ? claims
      : claims.filter((c) => c.status === filterStatus);

  if (loading) return <div className="loading">Loading claims...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Manage Claims</h1>
        <span style={styles.count}>{filteredClaims.length} claims</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter */}
      <div style={styles.filterRow}>
        {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "PAID"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterStatus === status ? "#2563eb" : "white",
                color: filterStatus === status ? "white" : "#475569",
              }}
            >
              {status}
            </button>
          ),
        )}
      </div>

      {/* Review Panel */}
      {selectedClaim && (
        <div className="card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <div className="card-title">
            Review Claim #{selectedClaim.id} — {selectedClaim.title}
          </div>
          <p style={{ color: "#64748b", marginBottom: "12px" }}>
            {selectedClaim.description}
          </p>
          <p style={{ marginBottom: "16px" }}>
            <strong>Amount:</strong> ₹{selectedClaim.claimAmount}
          </p>
          <div className="form-group">
            <label>Review Notes / Rejection Reason</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for the customer..."
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(selectedClaim.id, "APPROVED")}
              disabled={updating === selectedClaim.id}
            >
              ✅ Approve
            </button>
            <button
              className="btn"
              style={{ backgroundColor: "#0891b2", color: "white" }}
              onClick={() =>
                handleUpdateStatus(selectedClaim.id, "UNDER_REVIEW")
              }
              disabled={updating === selectedClaim.id}
            >
              🔍 Under Review
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleUpdateStatus(selectedClaim.id, "REJECTED")}
              disabled={updating === selectedClaim.id}
            >
              ❌ Reject
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleUpdateStatus(selectedClaim.id, "PAID")}
              disabled={updating === selectedClaim.id}
            >
              💰 Mark as Paid
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedClaim(null);
                setNotes("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Claims Table */}
      <div className="card">
        {filteredClaims.length === 0 ? (
          <div className="empty-state">
            <h3>No claims found</h3>
            <p>No claims with status {filterStatus}</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>User ID</th>
                  <th>Policy ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Filed On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>#{claim.id}</td>
                    <td>{claim.title}</td>
                    <td>{claim.userId}</td>
                    <td>{claim.policyId}</td>
                    <td>₹{claim.claimAmount}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        style={{ padding: "5px 12px", fontSize: "12px" }}
                        onClick={() => {
                          setSelectedClaim(claim);
                          setNotes("");
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  count: {
    backgroundColor: "#e2e8f0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    color: "#475569",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  filterBtn: {
    padding: "6px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

export default AdminClaims;
