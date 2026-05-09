import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPolicies } from "../../api/policyApi";
import { getMyClaims } from "../../api/claimsApi";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [myPolicies, setMyPolicies] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesRes, claimsRes] = await Promise.all([
          getMyPolicies(),
          getMyClaims(),
        ]);
        setMyPolicies(policiesRes.data.data || []);
        setMyClaims(claimsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activePolicies = myPolicies.filter((p) => p.status === "ACTIVE");
  const pendingClaims = myClaims.filter((c) => c.status === "PENDING");
  const approvedClaims = myClaims.filter((c) => c.status === "APPROVED");

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dbeafe" }}>
            📋
          </div>
          <div className="stat-info">
            <h3>{myPolicies.length}</h3>
            <p>Total Policies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dcfce7" }}>
            ✅
          </div>
          <div className="stat-info">
            <h3>{activePolicies.length}</h3>
            <p>Active Policies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            📝
          </div>
          <div className="stat-info">
            <h3>{myClaims.length}</h3>
            <p>Total Claims</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            ⏳
          </div>
          <div className="stat-info">
            <h3>{pendingClaims.length}</h3>
            <p>Pending Claims</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dcfce7" }}>
            💰
          </div>
          <div className="stat-info">
            <h3>{approvedClaims.length}</h3>
            <p>Approved Claims</p>
          </div>
        </div>
      </div>

      {/* Recent Policies */}
      <div className="card">
        <div className="card-title">My Active Policies</div>
        {activePolicies.length === 0 ? (
          <div className="empty-state">
            <h3>No active policies</h3>
            <p>Browse available policies and subscribe to one</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Policy Name</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Coverage</th>
                  <th>Start Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activePolicies.map((up) => (
                  <tr key={up.id}>
                    <td>{up.policy?.name}</td>
                    <td>{up.policy?.policyType}</td>
                    <td>₹{up.policy?.premium}/mo</td>
                    <td>₹{up.policy?.coverageAmount}</td>
                    <td>{new Date(up.startDate).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-success">{up.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div className="card-title">Recent Claims</div>
        {myClaims.length === 0 ? (
          <div className="empty-state">
            <h3>No claims filed yet</h3>
            <p>File a claim against your active policy</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Filed On</th>
                </tr>
              </thead>
              <tbody>
                {myClaims.slice(0, 5).map((claim) => (
                  <tr key={claim.id}>
                    <td>{claim.title}</td>
                    <td>₹{claim.claimAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          claim.status === "APPROVED"
                            ? "badge-success"
                            : claim.status === "REJECTED"
                              ? "badge-danger"
                              : claim.status === "PENDING"
                                ? "badge-warning"
                                : "badge-info"
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
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

export default CustomerDashboard;
