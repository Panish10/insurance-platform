import React, { useState, useEffect } from "react";
import { getMyPolicies } from "../../api/policyApi";

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
    } catch (err) {
      setError("Failed to load your policies");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your policies...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">My Policies</h1>
        <span style={styles.count}>{myPolicies.length} total</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {myPolicies.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No policies yet</h3>
            <p>Go to Policies page to subscribe to a plan</p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {myPolicies.map((up) => (
            <div key={up.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.policyName}>{up.policy?.name}</h3>
                <span
                  className={`badge ${
                    up.status === "ACTIVE"
                      ? "badge-success"
                      : up.status === "EXPIRED"
                        ? "badge-danger"
                        : up.status === "CANCELLED"
                          ? "badge-gray"
                          : "badge-warning"
                  }`}
                >
                  {up.status}
                </span>
              </div>

              <div style={styles.typeRow}>
                <span className="badge badge-info">
                  {up.policy?.policyType}
                </span>
              </div>

              <div style={styles.details}>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Monthly Premium</span>
                  <span style={styles.value}>₹{up.policy?.premium}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Coverage Amount</span>
                  <span style={styles.value}>₹{up.policy?.coverageAmount}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Duration</span>
                  <span style={styles.value}>
                    {up.policy?.durationMonths} months
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Start Date</span>
                  <span style={styles.value}>
                    {new Date(up.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.label}>End Date</span>
                  <span style={styles.value}>
                    {up.endDate
                      ? new Date(up.endDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.label}>Subscribed On</span>
                  <span style={styles.value}>
                    {new Date(up.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  policyName: { fontSize: "17px", fontWeight: "600", color: "#1e293b" },
  typeRow: { marginBottom: "16px" },
  details: { display: "flex", flexDirection: "column", gap: "10px" },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "8px",
    borderBottom: "1px solid #f1f5f9",
  },
  label: { fontSize: "13px", color: "#64748b" },
  value: { fontSize: "14px", fontWeight: "500", color: "#1e293b" },
};

export default MyPolicies;
