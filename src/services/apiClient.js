// src/services/apiClient.js
import axios from 'axios';

// Ensure baseURL always ends with /api/v1 regardless of how VITE_API_BASE_URL was configured
const rawBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').trim();
const cleanBase = rawBase.replace(/\/+$/, '');
const baseURL = cleanBase.endsWith('/api/v1') ? cleanBase : `${cleanBase}/api/v1`;

export const apiClient = axios.create({
  baseURL,
  timeout: 60000, // 60s timeout to allow for Render cold starts
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('toms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('toms_token');
      localStorage.removeItem('toms_user');
    }
    return Promise.reject(error);
  }
);
