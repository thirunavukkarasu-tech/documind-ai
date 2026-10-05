import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens (Phase 2+)
apiClient.interceptors.request.use((config) => {
  // Token will be added in Phase 2
  return config;
});

// Add response interceptor for error handling (Phase 2+)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error handling will be improved in Phase 2
    return Promise.reject(error);
  }
);

export default apiClient;
