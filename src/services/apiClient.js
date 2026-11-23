import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach JWT token to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('daylens_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error logging and session handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired session
      const hadToken = !!localStorage.getItem('daylens_token');
      if (hadToken) {
        localStorage.removeItem('daylens_token');
        localStorage.removeItem('daylens_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
