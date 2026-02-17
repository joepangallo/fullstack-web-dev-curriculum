/**
 * =============================================================
 * API CLIENT - Axios Instance with Auth Interceptor
 * =============================================================
 *
 * Full-stack version of the API client with:
 *   - Auto-attached JWT token on every request
 *   - 401 response handling (auto-logout on expired token)
 *   - Request timeout
 *
 * INTERCEPTOR FLOW:
 *   Request:  Add Authorization header with Bearer token
 *   Response: If 401, clear auth and redirect to login
 *
 * This client is used by both AuthContext (login/register)
 * and the Tasks page (CRUD operations).
 * =============================================================
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (unauthorized) globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - force logout
      localStorage.removeItem('authToken');

      // Only redirect if not already on a public page
      const publicPaths = ['/login', '/register'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
