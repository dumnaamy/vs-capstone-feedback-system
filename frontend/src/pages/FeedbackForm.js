import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FeedbackForm-3D.css"; // Still use the custom styles but they will be simplified
import { FaCheckCircle, FaExclamationCircle, FaSignOutAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import Chatbot from "../components/Chatbot";

export default function FeedbackForm() {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  // Simple star rating component
  const StarRating = ({ value, onChange }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(String(star))}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 0
            }}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <FaStar size={20} color={Number(value) >= star ? '#f5c518' : '#9aa0a6'} />
          </button>
        ))}
        <span style={{ fontSize: '0.9rem', color: '#cfd4da', marginLeft: '8px' }}>
          {value ? `${value}/5` : 'Rate'}
        </span>
      </div>
    );
  };

  // Predefined courses
  const predefinedCourses = [
    { id: "1", name: "B.Tech CSE AI" },
    { id: "2", name: "BBA" },
    { id: "3", name: "MBA" },
    { id: "4", name: "BCA" }
  ];

  // Map of course name to max years
  const courseYearLimits = {
    "B.Tech CSE AI": 4,
    "BBA": 3,
    "MBA": 2,
    "BCA": 3
  };

  // Course+Year to subjects (exactly 4 for B.Tech CSE AI)
  const courseYearSubjects = {
    "B.Tech CSE AI": {
      "1": [
        { id: "cse1-1", name: "Programming Fundamentals", teacher: "Dr. Rao", concept_clarity: "", suggestion: "" },
        { id: "cse1-2", name: "Mathematics I", teacher: "Dr. Mehta", concept_clarity: "", suggestion: "" },
        { id: "cse1-3", name: "Engineering Physics", teacher: "Dr. Kapoor", concept_clarity: "", suggestion: "" },
        { id: "cse1-4", name: "Professional English", teacher: "Dr. Sharma", concept_clarity: "", suggestion: "" }
      ],
      "2": [
        { id: "cse2-1", name: "Data Structures", teacher: "Prof. Nanda", concept_clarity: "", suggestion: "" },
        { id: "cse2-2", name: "Discrete Mathematics", teacher: "Dr. Banerjee", concept_clarity: "", suggestion: "" },
        { id: "cse2-3", name: "Object Oriented Programming", teacher: "Dr. Khanna", concept_clarity: "", suggestion: "" },
        { id: "cse2-4", name: "Database Systems", teacher: "Dr. Verma", concept_clarity: "", suggestion: "" }
      ],
      "3": [
        { id: "cse3-1", name: "Algorithms", teacher: "Dr. Iyer", concept_clarity: "", suggestion: "" },
        { id: "cse3-2", name: "Operating Systems", teacher: "Prof. Gupta", concept_clarity: "", suggestion: "" },
        { id: "cse3-3", name: "Computer Networks", teacher: "Dr. Bedi", concept_clarity: "", suggestion: "" },
        { id: "cse3-4", name: "Software Engineering", teacher: "Dr. Ahuja", concept_clarity: "", suggestion: "" }
      ],
      "4": [
        { id: "cse4-1", name: "AI & Machine Learning", teacher: "Dr. Singh", concept_clarity: "", suggestion: "" },
        { id: "cse4-2", name: "Cloud Computing", teacher: "Prof. Reddy", concept_clarity: "", suggestion: "" },
        { id: "cse4-3", name: "Cybersecurity", teacher: "Dr. Jain", concept_clarity: "", suggestion: "" },
        { id: "cse4-4", name: "Capstone Project Seminar", teacher: "Dr. Kaur", concept_clarity: "", suggestion: "" }
      ]
    },
    "BBA": {
      "1": [
        { id: "bba1-1", name: "Principles of Management", teacher: "Prof. Malhotra", concept_clarity: "", suggestion: "" },
        { id: "bba1-2", name: "Business Economics", teacher: "Dr. Chawla", concept_clarity: "", suggestion: "" },
        { id: "bba1-3", name: "Financial Accounting", teacher: "Dr. Sinha", concept_clarity: "", suggestion: "" },
        { id: "bba1-4", name: "Business Communication", teacher: "Prof. Arora", concept_clarity: "", suggestion: "" }
      ],
      "2": [
        { id: "bba2-1", name: "Marketing Management", teacher: "Dr. Pillai", concept_clarity: "", suggestion: "" },
        { id: "bba2-2", name: "Human Resource Management", teacher: "Prof. Dutta", concept_clarity: "", suggestion: "" },
        { id: "bba2-3", name: "Business Statistics", teacher: "Dr. Rao", concept_clarity: "", suggestion: "" },
        { id: "bba2-4", name: "Corporate Accounting", teacher: "Dr. Sharma", concept_clarity: "", suggestion: "" }
      ],
      "3": [
        { id: "bba3-1", name: "Operations Management", teacher: "Prof. Agarwal", concept_clarity: "", suggestion: "" },
        { id: "bba3-2", name: "International Business", teacher: "Dr. Kapoor", concept_clarity: "", suggestion: "" },
        { id: "bba3-3", name: "Entrepreneurship", teacher: "Dr. Jain", concept_clarity: "", suggestion: "" },
        { id: "bba3-4", name: "Financial Management", teacher: "Prof. Bansal", concept_clarity: "", suggestion: "" }
      ]
    },
    "MBA": {
      "1": [
        { id: "mba1-1", name: "Managerial Economics", teacher: "Dr. Mehra", concept_clarity: "", suggestion: "" },
        { id: "mba1-2", name: "Quantitative Techniques", teacher: "Prof. Kulkarni", concept_clarity: "", suggestion: "" },
        { id: "mba1-3", name: "Accounting for Managers", teacher: "Dr. Thomas", concept_clarity: "", suggestion: "" },
        { id: "mba1-4", name: "Business Communication", teacher: "Prof. Batra", concept_clarity: "", suggestion: "" }
      ],
      "2": [
        { id: "mba2-1", name: "Marketing Management", teacher: "Dr. Rao", concept_clarity: "", suggestion: "" },
        { id: "mba2-2", name: "Financial Management", teacher: "Prof. Desai", concept_clarity: "", suggestion: "" },
        { id: "mba2-3", name: "Operations Management", teacher: "Dr. Bose", concept_clarity: "", suggestion: "" },
        { id: "mba2-4", name: "Organizational Behavior", teacher: "Dr. Narayan", concept_clarity: "", suggestion: "" }
      ]
    },
    "BCA": {
      "1": [
        { id: "bca1-1", name: "Computer Fundamentals", teacher: "Prof. Mishra", concept_clarity: "", suggestion: "" },
        { id: "bca1-2", name: "Mathematics I", teacher: "Dr. Sharma", concept_clarity: "", suggestion: "" },
        { id: "bca1-3", name: "Programming in C", teacher: "Dr. Patel", concept_clarity: "", suggestion: "" },
        { id: "bca1-4", name: "Business Communication", teacher: "Prof. Joshi", concept_clarity: "", suggestion: "" }
      ],
      "2": [
        { id: "bca2-1", name: "Data Structures", teacher: "Dr. Kuldeep", concept_clarity: "", suggestion: "" },
        { id: "bca2-2", name: "Object Oriented Programming", teacher: "Prof. Rao", concept_clarity: "", suggestion: "" },
        { id: "bca2-3", name: "Database Management Systems", teacher: "Dr. Nair", concept_clarity: "", suggestion: "" },
        { id: "bca2-4", name: "Web Technologies", teacher: "Prof. Das", concept_clarity: "", suggestion: "" }
      ],
      "3": [
        { id: "bca3-1", name: "Operating Systems", teacher: "Dr. Garg", concept_clarity: "", suggestion: "" },
        { id: "bca3-2", name: "Computer Networks", teacher: "Prof. Rao", concept_clarity: "", suggestion: "" },
        { id: "bca3-3", name: "Software Engineering", teacher: "Dr. Kapoor", concept_clarity: "", suggestion: "" },
        { id: "bca3-4", name: "Python Programming", teacher: "Dr. Saini", concept_clarity: "", suggestion: "" }
      ]
    }
  };

 

  const [studentData, setStudentData] = useState({
    regNo: "",
    email: "",
    name: "",
    course: "",
    year: "",
    subjects: [],
    selectedSubjects: [],
    selectedDropdownSubject: null
  });
  
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Check if student is authenticated
  useEffect(() => {
    const studentToken = localStorage.getItem('studentToken');
    const studentRegNo = localStorage.getItem('studentRegNo');
    if (!studentToken || !studentRegNo) {
      navigate('/Student-Login');
      return;
    }
    
    // Pre-fill student data if available
    if (studentRegNo) {
      setStudentData(prev => ({
        ...prev,
        regNo: studentRegNo
      }));
    }
    
    // Load all courses initially
    setCourses(predefinedCourses);
  }, [navigate]);

  // Generate year options based on selected course
  const generateYearOptions = (selectedCourseName) => {
    const maxYears = courseYearLimits[selectedCourseName] || 0;
    return Array.from({ length: maxYears }, (_, i) => String(i + 1));
  };

  // Update subjects when course/year changes
  const updateSubjectsForSelection = (courseName, yearValue) => {
    if (courseName && yearValue && courseYearSubjects[courseName] && courseYearSubjects[courseName][yearValue]) {
      setSubjects(courseYearSubjects[courseName][yearValue]);
    } else {
      setSubjects([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get the student token for authentication
      const studentToken = localStorage.getItem('studentToken');
      if (!studentToken) {
        setMessage({ type: "error", text: "Authentication required. Please login again." });
        navigate('/Student-Login');
        return;
      }

      // Create a simple feedback submission that works with the current backend
      const feedbackData = {
        userId: localStorage.getItem('studentRegNo'), // Using reg number as userId
        rating: 5, // Default rating
        comments: `Student: ${studentData.name} (${studentData.regNo})\nEmail: ${studentData.email}\nCourse: ${studentData.course}\nYear: ${studentData.year}\nSubjects Feedback: ${JSON.stringify(subjects)}\nSelected Subject: ${studentData.selectedDropdownSubject?.name || 'None'}`,
        category: 'academic'
      };
      
      // Send request with authentication header
      await axios.post(`${API_BASE}/api/feedback/`, feedbackData, {
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMessage({ type: "success", text: "Feedback submitted successfully!" });
      
      // Reset form
      setStudentData({
        regNo: "",
        email: "",
        name: "",
        year: "",
        course: "",
        subjects: [],
        selectedSubjects: [],
        selectedDropdownSubject: null
      });
      setSubjects([]);
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response?.status === 401) {
        setMessage({ type: "error", text: "Authentication failed. Please login again." });
        navigate('/Student-Login');
      } else {
        setMessage({ type: "error", text: `Submission failed: ${err.response?.data?.message || err.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle subject feedback change
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setSubjects(updatedSubjects);
  };


  // Handle student logout
  const handleStudentLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentRegNo');
    navigate('/');
  };

  return (
    <div className="feedback-form-container">
      <div className="form-wrapper card-panel">
        {/* Student Info Header */}
        <div className="student-info-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div>
            <h3 style={{ margin: 0, color: '#ffffff' }}>
              Welcome, Student! 
              {localStorage.getItem('studentRegNo') && (
                <span style={{ fontSize: '0.9em', opacity: 0.8 }}>
                  (Reg: {localStorage.getItem('studentRegNo')})
                </span>
              )}
            </h3>
            <p style={{ margin: '5px 0 0 0', color: '#cccccc', fontSize: '0.9em' }}>
              Please provide your valuable feedback
            </p>
          </div>
          <button
            type="button"
            onClick={handleStudentLogout}
            style={{
              background: 'rgba(220, 53, 69, 0.8)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9em'
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {message.text && (
          <div className={`message alert-message alert-${message.type}`}>
            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {subjects.length > 0 ? (
            <div className="feedback-sections-container">
              <div className="form-section student-info-section">
                <h2>Student Information</h2>

                <div className="form-group">
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter registration number"
                    value={studentData.regNo}
                    onChange={(e) => setStudentData({...studentData, regNo: e.target.value})}
                    required
                    readOnly
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cccccc' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={studentData.email}
                    onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full name"
                    value={studentData.name}
                    onChange={(e) => setStudentData({...studentData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course</label>
                  <select
                    className="form-select"
                    value={studentData.course}
                    onChange={(e) => {
                      const selectedCourse = e.target.value;
                      const allowedYears = generateYearOptions(selectedCourse);
                      const nextYear = allowedYears.includes(studentData.year) ? studentData.year : "";
                      setStudentData({...studentData, course: selectedCourse, year: nextYear});
                      // Update subjects based on new selection
                      updateSubjectsForSelection(selectedCourse, nextYear);
                    }}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select
                    className="form-select"
                    value={studentData.year}
                    onChange={(e) => {
                      const selectedYear = e.target.value;
                      setStudentData({...studentData, year: selectedYear});
                      // Update subjects based on course + new year
                      updateSubjectsForSelection(studentData.course, selectedYear);
                    }}
                    required
                    disabled={!studentData.course}
                  >
                    <option value="">Select Year</option>
                    {generateYearOptions(studentData.course).map((year) => (
                      <option key={year} value={year}>
                        {year === "1" ? "1st Year" : year === "2" ? "2nd Year" : year === "3" ? "3rd Year" : `${year}th Year`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section subject-feedback-section">
                <h2>Subject Feedback</h2>

                <div className="subjects-feedback">
                  {subjects.map((subject, index) => (
                    <div
                      key={subject.id}
                      className="subject-feedback-card"
                    >
                      <h4 className="subject-title">
                        <span>{subject.name}</span>
                        <span className="teacher-badge">
                          {subject.teacher}
                        </span>
                      </h4>

                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                          Concept Clarity
                        </label>
                        <StarRating
                          value={subject.concept_clarity}
                          onChange={(val) => handleSubjectChange(index, "concept_clarity", val)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Suggestions</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Enter your suggestions for this subject..."
                          value={subject.suggestion}
                          onChange={(e) => handleSubjectChange(index, "suggestion", e.target.value)}
                          rows="3"
                          style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.18)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="form-section">
              <h2>Student Information</h2>

              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter registration number"
                  value={studentData.regNo}
                  onChange={(e) => setStudentData({...studentData, regNo: e.target.value})}
                  required
                  readOnly
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cccccc' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={studentData.email}
                  onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter full name"
                  value={studentData.name}
                  onChange={(e) => setStudentData({...studentData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  className="form-select"
                  value={studentData.course}
                  onChange={(e) => {
                    const selectedCourse = e.target.value;
                    const allowedYears = generateYearOptions(selectedCourse);
                    const nextYear = allowedYears.includes(studentData.year) ? studentData.year : "";
                    setStudentData({...studentData, course: selectedCourse, year: nextYear});
                    // Update subjects based on new selection
                    updateSubjectsForSelection(selectedCourse, nextYear);
                  }}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  className="form-select"
                  value={studentData.year}
                  onChange={(e) => {
                    const selectedYear = e.target.value;
                    setStudentData({...studentData, year: selectedYear});
                    // Update subjects based on course + new year
                    updateSubjectsForSelection(studentData.course, selectedYear);
                  }}
                  required
                  disabled={!studentData.course}
                >
                  <option value="">Select Year</option>
                  {generateYearOptions(studentData.course).map((year) => (
                    <option key={year} value={year}>
                      {year === "1" ? "1st Year" : year === "2" ? "2nd Year" : year === "3" ? "3rd Year" : `${year}th Year`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={`button-primary ${loading ? 'loading' : ''}`}
            disabled={loading || subjects.length === 0}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
      <Chatbot />
    </div>
  );
}
