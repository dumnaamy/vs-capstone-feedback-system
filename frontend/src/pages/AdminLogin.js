import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { FaSignInAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './AdminLogin.css'; // Will be updated
import { api } from '../api';
import PasswordInput from '../components/PasswordInput';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the standard auth endpoint with username/email
      const response = await api.post('/api/auth/login', {
        identifier: credentials.username,  // Use identifier field for username/email
        password: credentials.password
      });
      login(response.data);
      navigate('/admin', { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-container card-container">
      <div className="admin-login-form card-panel">
        <div className="text-center mb-4">
          <FaSignInAlt className="login-icon" />
          <h2 className="card-title">Admin Login</h2>
        </div>

        {isAuthenticated && (
          <div className="alert-message alert-info">
            <FaCheckCircle /> You are already logged in.
            <div className="d-flex justify-content-center mt-3 gap-2">
              <button
                className="button-primary btn-sm"
                onClick={() => navigate('/admin')}
              >
                Go to Dashboard
              </button>
              <button
                className="button-secondary btn-sm"
                onClick={() => {
                  logout();
                  navigate('/admin-login', { replace: true });
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert-message alert-danger" role="alert">
                <FaExclamationCircle /> {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Enter admin username"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput
                name="password"
                className="form-input"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Enter admin password"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className={`button-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p>
            <Link to="/forgot-password" className="text-link">Forgot password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/admin-signup" className="text-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}