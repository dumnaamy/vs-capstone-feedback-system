// src/components/pages/StaffDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCalendar,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaHome,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";
import { fetchFeedback } from "../feedbackApi";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [showDetailed, setShowDetailed] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("staffUsername");
    const token = localStorage.getItem("staffToken");

    if (!token) {
      navigate("/staff-login");
    } else {
      setUsername(storedUsername || "Staff Member");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffUsername");
    navigate("/staff-login");
  };

  useEffect(() => {
    // Fetch feedback data on component mount
    fetchFeedback()
      .then((data) => {
        setFeedback(data);
        if (data.length > 0) {
          const avg =
            data.reduce((acc, fb) => acc + fb.rating, 0) / data.length;
          setAverageRating(avg.toFixed(1));
          setTotalFeedback(data.length);
        } else {
          setAverageRating(0);
          setTotalFeedback(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching feedback:", err);
      });
  }, []);

  return (
    <div className="staff-dashboard-container container-fluid mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">
          <FaHome className="me-2" />
          Staff Dashboard
        </h2>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">Welcome, {username}!</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          <div className="row g-4">
            {/* Feedback Summary */}
            <div className="card shadow-lg rounded-2xl">
              <div className="card-header">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <FaChartBar className="w-5 h-5" /> Feedback Summary
                </h5>
              </div>
              <div className="card-body">
                <p className="text-xl font-semibold">⭐ {averageRating} / 5</p>
                <p className="text-sm text-muted">
                  Based on {totalFeedback} feedback entries
                </p>
                <button
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => setShowDetailed(!showDetailed)}
                >
                  {showDetailed ? "Hide" : "View"} Detailed Feedback
                </button>
              </div>
            </div>

            {/* Attendance Quick Stats */}
            <div className="card shadow-lg rounded-2xl">
              <div className="card-header">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <FaUsers className="w-5 h-5" /> Attendance Overview
                </h5>
              </div>
              <div className="card-body">
                <p className="text-xl font-semibold">82% Avg Attendance</p>
                <p className="text-sm text-muted">10 students &lt;75%</p>
                <button className="btn btn-outline-primary mt-3 w-100">
                  View Attendance
                </button>
              </div>
            </div>

            {/* Today's Classes */}
            <div className="card shadow-lg rounded-2xl">
              <div className="card-header">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <FaCalendar className="w-5 h-5" /> Today's Classes
                </h5>
              </div>
              <div className="card-body">
                <ul className="space-y-2 text-sm">
                  <li>10:00 AM – Data Structures (B.Tech CSE)</li>
                  <li>1:00 PM – DBMS Lab (Batch A)</li>
                  <li>3:00 PM – Compiler Design (Batch B)</li>
                </ul>
                <button className="btn btn-outline-primary mt-3 w-100">
                  View Timetable
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="card shadow-lg rounded-2xl">
              <div className="card-header">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <FaBell className="w-5 h-5" /> Notifications
                </h5>
              </div>
              <div className="card-body">
                <ul className="space-y-2 text-sm">
                  <li>📢 Internal exams start next week</li>
                  <li>📢 Faculty meeting at 4:30 PM</li>
                  <li>📢 Submit grades by Friday</li>
                </ul>
                <button className="btn btn-outline-primary mt-3 w-100">
                  View All
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="card shadow-lg rounded-2xl">
              <div className="card-header">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <FaFileAlt className="w-5 h-5" /> Resources
                </h5>
              </div>
              <div className="card-body">
                <p className="text-sm">
                  Upload and share lecture notes, assignments, or reference
                  material with students.
                </p>
                <button className="btn btn-outline-primary mt-3 w-100">
                  Upload Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback Section */}
      {showDetailed && (
        <div className="p-6 transition-all duration-300">
          <div className="card shadow-lg rounded-2xl">
            <div className="card-header">
              <h5 className="card-title d-flex align-items-center gap-2">
                <FaFileAlt className="w-5 h-5" /> Detailed Feedback
              </h5>
            </div>
            <div className="card-body">
              {feedback.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedback.map((fb, index) => (
                    <div
                      key={fb.id || index}
                      className="border rounded p-3 shadow-sm bg-light"
                    >
                      {/* Student Info */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong>
                            {fb.studentInfo?.name ||
                              fb.studentName ||
                              "Anonymous"}
                          </strong>
                          <span className="text-muted ms-2">
                            ({fb.studentInfo?.regNo || "N/A"})
                          </span>
                        </div>

                        {/* Rating Stars */}
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`me-1 ${
                                i < fb.rating ? "text-warning" : "text-secondary"
                              }`}
                            />
                          ))}
                          <span className="ms-1">({fb.rating}/5)</span>
                        </div>
                      </div>

                      {/* Course / Year / Email */}
                      <p className="mb-1 text-muted small">
                        {fb.studentInfo?.course && `📘 ${fb.studentInfo.course} `}
                        {fb.studentInfo?.year &&
                          ` | 🎓 Year ${fb.studentInfo.year}`}
                        {fb.studentInfo?.email &&
                          ` | ✉️ ${fb.studentInfo.email}`}
                      </p>

                      {/* Feedback Text */}
                      <p className="mb-1">{fb.comments || fb.feedback}</p>

                      {/* Timestamp */}
                      <small className="text-muted">
                        {new Date(fb.createdAt || fb.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted">
                  No feedback available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
