import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../api/authApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = filterRole === "ALL" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div style={styles.container}>
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <span style={styles.count}>{filteredUsers.length} users</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Filter */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterRow}>
          {["ALL", "ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_AGENT"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filterRole === role ? "#2563eb" : "white",
                color: filterRole === role ? "white" : "#475569",
              }}
            >
              {role === "ALL"
                ? "All"
                : role === "ROLE_CUSTOMER"
                  ? "Customers"
                  : role === "ROLE_ADMIN"
                    ? "Admins"
                    : "Agents"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try a different search or filter</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div style={styles.nameCell}>
                        <div style={styles.avatar}>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "ROLE_ADMIN"
                            ? "badge-danger"
                            : user.role === "ROLE_AGENT"
                              ? "badge-warning"
                              : "badge-info"
                        }`}
                      >
                        {user.role === "ROLE_ADMIN"
                          ? "Admin"
                          : user.role === "ROLE_AGENT"
                            ? "Agent"
                            : "Customer"}
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
  toolbar: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    maxWidth: "400px",
  },
  filterRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
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
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },
};

export default AdminUsers;
