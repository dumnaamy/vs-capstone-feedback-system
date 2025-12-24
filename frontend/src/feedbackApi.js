// frontend/src/components/api/feedbackApi.js
import { api } from './api';

// Submit feedback
export function submitFeedback(feedbackData) {
  return api.post('/api/feedback/', feedbackData)
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to submit feedback:', error);
      throw new Error('Failed to submit feedback');
    });
}

// Fetch all feedback
export function fetchFeedback() {
  return api.get('/api/feedback/')
    .then(response => response.data)
    .catch(error => {
      console.error('Failed to fetch feedback:', error);
      throw new Error('Failed to fetch feedback');
    });
}
