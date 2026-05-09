import React, { useState, useEffect } from "react";
import { getMyClaims, submitClaim } from "../../api/claimsApi";

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
    } catch (err) {
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

  if (loading) return <div className="loading">Loading claims...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">My Claims</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ File New Claim"}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Submit Claim Form */}
      {showForm && (
        <div className="card">
          <div className="card-title">File a New Claim</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Policy ID</label>
              <input
                type="number"
                name="policyId"
                value={formData.policyId}
                onChange={handleChange}
                placeholder="Enter your policy ID"
                required
              />
            </div>
            <div className="form-group">
              <label>Claim Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Hospital admission claim"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your claim in detail..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="form-group">
              <label>Claim Amount (₹)</label>
              <input
                type="number"
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                required
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Claim"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Claims List */}
      <div className="card">
        <div className="card-title">Claims History</div>
        {claims.length === 0 ? (
          <div className="empty-state">
            <h3>No claims filed yet</h3>
            <p>Click "File New Claim" to submit your first claim</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Policy ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Filed On</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td>#{claim.id}</td>
                    <td>{claim.title}</td>
                    <td>{claim.policyId}</td>
                    <td>₹{claim.claimAmount}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td style={{ color: "#64748b", fontSize: "13px" }}>
                      {claim.rejectionReason || claim.reviewNotes || "-"}
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
};

export default MyClaims;
