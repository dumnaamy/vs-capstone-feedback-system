// src/components/pages/StudentForgotPassword.js
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { FaUserGraduate, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import PasswordInput from "../components/PasswordInput";
import "./StudentForgotPassword.css";

const OTP_EXPIRY = 300; // 5 minutes in seconds

const StudentForgotPassword = () => {
    const [form, setForm] = useState({ reg_no: "", email: "" });
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY);

    // Load token and timer from sessionStorage (only if user refreshes)
    useEffect(() => {
        const storedToken = sessionStorage.getItem("resetToken");
        const storedExpiry = sessionStorage.getItem("otpExpiry");
        if (storedToken && storedExpiry) {
            setResetToken(storedToken);
            const expiryTime = parseInt(storedExpiry, 10);
            const remaining = Math.max(expiryTime - Math.floor(Date.now() / 1000), 0);
            setTimeLeft(remaining);
            setStep(2);
        }
    }, []);

    // OTP countdown timer
    useEffect(() => {
        if (step !== 2 || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    sessionStorage.removeItem("resetToken");
                    sessionStorage.removeItem("otpExpiry");
                    setResetToken("");
                    setStep(1);
                    setMessage("");
                    setError("OTP expired. Please request a new one.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [step, timeLeft]);

    // Reset the whole forgot-password flow
    const resetForgotPasswordFlow = () => {
        setStep(1);
        setResetToken("");
        setTimeLeft(OTP_EXPIRY);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage("");
        setError("");
        sessionStorage.removeItem("resetToken");
        sessionStorage.removeItem("otpExpiry");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const requestOtp = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post("api/auth/forgot-password", {
                email: form.email
            });
            const token = response.data.resetToken;
            setResetToken(token);
            const expiry = Math.floor(Date.now() / 1000) + OTP_EXPIRY;
            sessionStorage.setItem("resetToken", token);
            sessionStorage.setItem("otpExpiry", expiry.toString());
            setTimeLeft(OTP_EXPIRY);
            setMessage(response.data.message || "OTP sent successfully. Check your email.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Verification failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        requestOtp();
    };

    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!resetToken) {
            setError("Reset token missing. Please start again.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("api/auth/verify-otp", {
                otp,
                token: resetToken
            });
            setMessage(response.data.message || "OTP verified successfully.");
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || "OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStep3Submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!resetToken) {
            setError("Reset token missing. Please start again.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("api/auth/reset-password", {
                token: resetToken,
                newPassword
            });
            setMessage(response.data.message || "Password reset successfully!");
            sessionStorage.removeItem("resetToken");
            sessionStorage.removeItem("otpExpiry");
            setTimeout(() => {
                window.location.href = "/student-login";
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="student-forgot-password-container card-container">
            <div className="forgot-password-card card-panel">
                <div className="text-center mb-4">
                    <FaUserGraduate className="login-icon" />
                    <h2 className="card-title">Reset Your Password</h2>
                    <p className="card-subtitle">
                        {step === 1 && "Enter your details to receive a verification code."}
                        {step === 2 && "Enter the OTP sent to your registered email."}
                        {step === 3 && "Create a new password for your account."}
                    </p>
                </div>

                {message && (
                    <div className="alert-message alert-success">
                        <FaCheckCircle />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert-message alert-danger">
                        <FaExclamationCircle />
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleStep1Submit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="reg_no"
                                placeholder="Registration Number"
                                value={form.reg_no}
                                onChange={handleChange}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Registered Email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className={`button-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? <FaSpinner className="spinner" /> : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleStep2Submit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="otp-timer">
                            OTP expires in: <strong>{formatTime(timeLeft)}</strong>
                        </div>
                        {timeLeft === 0 && (
                            <button
                                type="button"
                                className="button-secondary"
                                onClick={requestOtp}
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="spinner" /> : "Resend OTP"}
                            </button>
                        )}
                        <button type="submit" className={`button-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? <FaSpinner className="spinner" /> : "Verify OTP"}
                        </button>
                        {step !== 1 && (
                            <button
                                type="button"
                                className="button-secondary"
                                onClick={resetForgotPasswordFlow}
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleStep3Submit}>
                        <div className="form-group">
                <PasswordInput
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="form-input"
                    required
                    disabled={loading}
                />
                        </div>
                        <div className="form-group">
                            <PasswordInput
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="form-input"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className={`button-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? <FaSpinner className="spinner" /> : "Reset Password"}
                        </button>
                        {step !== 1 && (
                            <button
                                type="button"
                                className="button-secondary"
                                onClick={resetForgotPasswordFlow}
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentForgotPassword;
