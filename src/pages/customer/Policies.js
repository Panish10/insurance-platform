import React, { useState, useEffect } from "react";
import { getActivePolicies, subscribeToPolicy } from "../../api/policyApi";

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
    } catch (err) {
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

  if (loading) return <div className="loading">Loading policies...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Available Policies</h1>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid-2">
        {policies.length === 0 ? (
          <div className="empty-state">
            <h3>No active policies available</h3>
            <p>Check back later for new policies</p>
          </div>
        ) : (
          policies.map((policy) => (
            <div key={policy.id} style={styles.policyCard}>
              <div style={styles.policyHeader}>
                <div>
                  <h3 style={styles.policyName}>{policy.name}</h3>
                  <span
                    className={`badge ${
                      policy.policyType === "HEALTH"
                        ? "badge-success"
                        : policy.policyType === "LIFE"
                          ? "badge-info"
                          : policy.policyType === "VEHICLE"
                            ? "badge-warning"
                            : "badge-gray"
                    }`}
                  >
                    {policy.policyType}
                  </span>
                </div>
                <div style={styles.premium}>
                  <span style={styles.premiumAmount}>₹{policy.premium}</span>
                  <span style={styles.premiumLabel}>/month</span>
                </div>
              </div>

              {policy.description && (
                <p style={styles.description}>{policy.description}</p>
              )}

              <div style={styles.details}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Coverage</span>
                  <span style={styles.detailValue}>
                    ₹{policy.coverageAmount}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Duration</span>
                  <span style={styles.detailValue}>
                    {policy.durationMonths} months
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Status</span>
                  <span className="badge badge-success">{policy.status}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => handleSubscribe(policy.id, policy.name)}
                disabled={subscribing === policy.id}
              >
                {subscribing === policy.id ? "Subscribing..." : "Subscribe Now"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  policyCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  policyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  policyName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "6px",
  },
  premium: { textAlign: "right" },
  premiumAmount: { fontSize: "24px", fontWeight: "700", color: "#2563eb" },
  premiumLabel: { fontSize: "13px", color: "#64748b", marginLeft: "2px" },
  description: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "16px",
    lineHeight: "1.5",
  },
  details: { display: "flex", flexDirection: "column", gap: "8px" },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: "13px", color: "#64748b" },
  detailValue: { fontSize: "14px", fontWeight: "500", color: "#1e293b" },
};

export default Policies;
