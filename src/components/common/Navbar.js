import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🛡️ InsuranceApp</div>

      <div style={styles.links}>
        {user && (
          <>
            {isAdmin() ? (
              <>
                <Link to="/admin/dashboard" style={styles.link}>
                  Dashboard
                </Link>
                <Link to="/admin/policies" style={styles.link}>
                  Policies
                </Link>
                <Link to="/admin/claims" style={styles.link}>
                  Claims
                </Link>
                <Link to="/admin/users" style={styles.link}>
                  Users
                </Link>
              </>
            ) : (
              <>
                <Link to="/customer/dashboard" style={styles.link}>
                  Dashboard
                </Link>
                <Link to="/customer/policies" style={styles.link}>
                  Policies
                </Link>
                <Link to="/customer/my-policies" style={styles.link}>
                  My Policies
                </Link>
                <Link to="/customer/claims" style={styles.link}>
                  My Claims
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div style={styles.userSection}>
        {user && (
          <>
            <span style={styles.userName}>
              👤 {user.firstName} {user.lastName}
            </span>
            <span style={styles.role}>
              {isAdmin() ? "🔑 Admin" : "👥 Customer"}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "60px",
    backgroundColor: "#1e293b",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#60a5fa",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "8px",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userName: {
    fontSize: "14px",
    color: "#e2e8f0",
  },
  role: {
    fontSize: "12px",
    padding: "3px 8px",
    backgroundColor: "#334155",
    borderRadius: "12px",
    color: "#94a3b8",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default Navbar;
