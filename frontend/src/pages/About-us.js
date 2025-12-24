// src/components/pages/About.js
import React from 'react';
import { FaBullhorn, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './About-us.css';
import BannerImage from '../assets/office.png'; // Assuming you have an image here

const About = () => {
  return (
    <div className="about-container">
      {/* New Banner Section */}
      <div className="about-banner">
        <img src={BannerImage} alt="Students learning together" className="banner-image" />
        <div className="banner-overlay">
          <h1 className="banner-title">Our Mission: Your Voice, Our Future.</h1>
        </div>
      </div>

      <div className="about-card card-panel">
        <h2 className="about-title">About Our Student Feedback System</h2>
        <p className="about-description">
          Our platform is designed to be a bridge between students and the faculty,
          providing a seamless and confidential way to share valuable feedback. We believe
          that every student's voice matters in shaping the future of our university.
        </p>

        <div className="about-features-section">
          <h3 className="features-title">How We Help</h3>
          <ul className="features-list">
            <li className="feature-item">
              <FaBullhorn className="feature-icon" />
              <div>
                <h4>Empowering Student Voices</h4>
                <p>Provide anonymous feedback on courses, faculty, and university resources to drive positive change.</p>
              </div>
            </li>
            <li className="feature-item">
              <FaGraduationCap className="feature-icon" />
              <div>
                <h4>Improving Course Quality</h4>
                <p>Your suggestions help us refine our curriculum and teaching methods to enhance your learning experience.</p>
              </div>
            </li>
            <li className="feature-item">
              <FaChartLine className="feature-icon" />
              <div>
                <h4>Enhancing Faculty Performance</h4>
                <p>Constructive feedback allows our faculty to grow and adapt their teaching styles to better meet student needs.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="about-cta">
          <Link to="/feedback" className="button-primary about-cta-button">
            Give Your Feedback Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;