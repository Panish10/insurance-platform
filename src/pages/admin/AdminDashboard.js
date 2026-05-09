import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../api/authApi";
import { getAllPolicies } from "../../api/policyApi";
import { getAllClaims } from "../../api/claimsApi";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, policiesRes, claimsRes] = await Promise.all([
          getAllUsers(),
          getAllPolicies(),
          getAllClaims(),
        ]);
        setUsers(usersRes.data.data || []);
        setPolicies(policiesRes.data.data || []);
        setClaims(claimsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingClaims = claims.filter((c) => c.status === "PENDING");
  const activePolicies = policies.filter((p) => p.status === "ACTIVE");

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard 🔑</h1>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dbeafe" }}>
            👥
          </div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dcfce7" }}>
            📋
          </div>
          <div className="stat-info">
            <h3>{policies.length}</h3>
            <p>Total Policies</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            ✅
          </div>
          <div className="stat-info">
            <h3>{activePolicies.length}</h3>
            <p>Active Policies</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            📝
          </div>
          <div className="stat-info">
            <h3>{claims.length}</h3>
            <p>Total Claims</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            ⏳
          </div>
          <div className="stat-info">
            <h3>{pendingClaims.length}</h3>
            <p>Pending Claims</p>
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="card">
        <div className="card-title">Recent Claims — Needs Review</div>
        {pendingClaims.length === 0 ? (
          <div className="empty-state">
            <h3>No pending claims</h3>
            <p>All claims have been reviewed</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Filed On</th>
                </tr>
              </thead>
              <tbody>
                {pendingClaims.slice(0, 5).map((claim) => (
                  <tr key={claim.id}>
                    <td>#{claim.id}</td>
                    <td>{claim.title}</td>
                    <td>{claim.userId}</td>
                    <td>₹{claim.claimAmount}</td>
                    <td>
                      <span className="badge badge-warning">
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

      {/* Recent Users */}
      <div className="card">
        <div className="card-title">Recent Users</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "ROLE_ADMIN"
                          ? "badge-danger"
                          : "badge-info"
                      }`}
                    >
                      {user.role === "ROLE_ADMIN" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.enabled ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {user.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
};

export default AdminDashboard;
