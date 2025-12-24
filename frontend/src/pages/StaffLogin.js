// src/components/pages/StaffLogin.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { FaUserCircle, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PasswordInput from "../components/PasswordInput";
import "./StaffLogin.css";

const StaffLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Use the standard auth endpoint with username/email
      const response = await api.post("/api/auth/login", {
        identifier: credentials.username,  // Use identifier field for username/email
        password: credentials.password
      });
      localStorage.setItem("staffToken", response.data.token);
      localStorage.setItem("staffUsername", credentials.username);
      navigate("/staff-dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffUsername");
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div className="staff-login-container card-container">
        <div className="staff-login-card card-panel">
          <div className="alert-message alert-success">
            <FaCheckCircle />
            <p>You are already logged in as <b>{localStorage.getItem("staffUsername")}</b>.</p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button 
                className="button-primary btn-sm" 
                onClick={() => navigate("/staff-dashboard")}
              >
                Go to Dashboard
              </button>
              <button 
                className="button-primary button-danger-style btn-sm" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-login-container card-container">
      <div className="staff-login-card card-panel">
        <div className="staff-login-header">
          <FaUserCircle className="login-icon" />
          <h1 className="staff-login-title">Staff Portal</h1>
          <p className="staff-login-subtitle">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="staff-login-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Username or Email"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <PasswordInput
              name="password"
              className="form-input"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="alert-message alert-danger"><FaExclamationCircle /> {error}</div>}

          <button 
            type="submit" 
            className={`button-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : "Log In"}
          </button>
        </form>

        <div className="login-footer text-center mt-4">
          <Link to="/forgot-password" className="text-link">Forgot password?</Link>
          <p className="signup-text">
            Don’t have an account? <Link to="/staff-signup" className="text-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;