const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Node API Gateway' });
});

// Submit Feedback
app.post('/api/feedback/submit/', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/api/submit-feedback/', req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get all feedback
app.get('/api/feedback/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/api/feedback/');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching feedback:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Get feedback stats
app.get('/api/feedback/stats/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/api/feedback/stats/');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching feedback stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch feedback stats' });
    }
});

// Admin login
app.post('/api/admin/login/', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/api/admin/login/', req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error with admin login:', error.message);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Node API Gateway running on port ${PORT}`);
});
