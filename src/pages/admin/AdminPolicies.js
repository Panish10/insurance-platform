import React, { useState, useEffect } from "react";
import { getAllPolicies, createPolicy } from "../../api/policyApi";

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
    } catch (err) {
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

  if (loading) return <div className="loading">Loading policies...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Manage Policies</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Create Policy"}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Create Policy Form */}
      {showForm && (
        <div className="card">
          <div className="card-title">Create New Policy</div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Policy Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Basic Health Plan"
                  required
                />
              </div>
              <div className="form-group">
                <label>Policy Type</label>
                <select
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                >
                  <option value="HEALTH">Health</option>
                  <option value="LIFE">Life</option>
                  <option value="VEHICLE">Vehicle</option>
                  <option value="HOME">Home</option>
                  <option value="TRAVEL">Travel</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Premium (₹)</label>
                <input
                  type="number"
                  name="premium"
                  value={formData.premium}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </div>
              <div className="form-group">
                <label>Coverage Amount (₹)</label>
                <input
                  type="number"
                  name="coverageAmount"
                  value={formData.coverageAmount}
                  onChange={handleChange}
                  placeholder="e.g. 100000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (months)</label>
                <input
                  type="number"
                  name="durationMonths"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this policy..."
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Policy"}
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

      {/* Policies Table */}
      <div className="card">
        <div className="card-title">All Policies ({policies.length})</div>
        {policies.length === 0 ? (
          <div className="empty-state">
            <h3>No policies created yet</h3>
            <p>Click "Create Policy" to add the first policy</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>#{policy.id}</td>
                    <td>{policy.name}</td>
                    <td>
                      <span className="badge badge-info">
                        {policy.policyType}
                      </span>
                    </td>
                    <td>₹{policy.premium}/mo</td>
                    <td>₹{policy.coverageAmount}</td>
                    <td>{policy.durationMonths} months</td>
                    <td>
                      <span
                        className={`badge ${
                          policy.status === "ACTIVE"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {policy.status}
                      </span>
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

export default AdminPolicies;
