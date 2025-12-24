import React, { useState, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { FaCommentAlt, FaUserShield, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";   // ✅ added useNavigate
import "./Home.css";
import ShooliniLogo from '../assets/Shoolini-University_logo-750x750.png';

const Home = () => {
    const [toast, setToast] = useState('');
    const navigate = useNavigate();   // ✅ useNavigate hook

    const showToast = (msg) => { 
        setToast(msg); 
        setTimeout(() => setToast(''), 3000); 
    };

    const heroAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-50px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { mass: 1, tension: 170, friction: 26 },
        delay: 200,
    });

    const quotes = useMemo(() => [
        "Your feedback is a gift",
        "Shape the future of our university",
        "Every opinion matters",
        "Help us build a better Shoolini"
    ], []);
    const [quote, setQuote] = useState(quotes[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newQuoteIndex = Math.floor(Math.random() * quotes.length);
            setQuote(quotes[newQuoteIndex]);
        }, 5000);
        return () => clearInterval(interval);
    }, [quotes]);

    const buttonsAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { mass: 1, tension: 280, friction: 60 },
        delay: 500,
    });

    return (
        <div className="home-container">
            <animated.div style={heroAnimation} className="hero-section">
                <div className="hero-card">
                    <div className="logo-container">
                        <div className="logo-glow"></div>
                        <img 
                            src={ShooliniLogo} 
                            alt="Shoolini University Logo" 
                            className="university-logo"
                            title="Shoolini University"
                        />
                    </div>

                    <div className="text-container">
                        <h1 className="main-title">
                            Shoolini University
                        </h1>
                        <h2 className="subtitle">
                            Welcome to Student Feedback System
                        </h2>
                        <p className="quote-text">{quote}</p>
                    </div>
                </div>
            </animated.div>
            
            <animated.div style={buttonsAnimation} className="center-buttons">
                {/* ✅ Changed Link to button with navigate */}
                <button 
                    onClick={() => {
                        showToast('Opening Student Login');
                        navigate("/student-login");
                    }} 
                    className="btn btn-primary"
                    title="Give your valuable feedback"
                >
                    <FaCommentAlt className="btn-icon" />
                    <span className="btn-text">Give Feedback</span>
                </button>

                <Link 
                    to="/login-selection" 
                    className="btn btn-secondary" 
                    title="Login as Admin or Staff" 
                    onClick={() => showToast('Opening Login') }
                >
                    <FaUserShield className="btn-icon" />
                    <span className="btn-text">Login</span>
                </Link>
            </animated.div>

            {toast && (
                <div className="simple-toast" role="status" aria-live="polite">
                    <FaCheckCircle className="toast-icon" />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Home;
