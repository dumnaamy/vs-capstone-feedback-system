import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { FaUnlockAlt, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import PasswordInput from '../components/PasswordInput';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    userType: 'staff'
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/forgot-password/', {
        email_or_phone: formData.emailOrPhone,
        user_type: formData.userType
      });
      
      setMessage(response.data.message);
      setUserId(response.data.user_id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/verify-otp/', {
        user_id: userId,
        otp: otp
      });
      
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/reset-password/', {
        user_id: userId,
        new_password: newPassword
      });
      
      setMessage(response.data.message);
      setTimeout(() => {
        window.location.href = '/login-selection';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container card-container">
      <div className="forgot-password-card card-panel">
        <div className="text-center mb-4">
          <FaUnlockAlt className="forgot-password-icon" />
          <h2 className="card-title">Forgot Password</h2>
          <p className="subtitle">Reset your password using your registered email or phone.</p>
        </div>

        {message && <div className="alert-message alert-success"><FaCheckCircle /> {message}</div>}
        {error && <div className="alert-message alert-danger"><FaExclamationCircle /> {error}</div>}

        {step === 1 && (
          <form onSubmit={handleVerifyEmail}>
            <div className="form-group">
              <label className="form-label">User Type</label>
              <select 
                name="userType" 
                value={formData.userType} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Enter your registered email or phone"
                className="form-input"
                required
              />
              <small className="form-text text-muted">
                You can use either your registered email address or phone number.
              </small>
            </div>

            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Send Verification'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <PasswordInput
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <PasswordInput
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="login-footer mt-4 text-center">
          <Link to="/login-selection" className="text-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;