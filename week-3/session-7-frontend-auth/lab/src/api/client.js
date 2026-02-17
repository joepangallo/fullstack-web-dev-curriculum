/**
 * =============================================================
 * API CLIENT - Configured Axios Instance
 * =============================================================
 *
 * Instead of using raw axios.get() / axios.post() everywhere,
 * we create a pre-configured instance with:
 *   - A base URL (so we don't repeat it in every request)
 *   - An auth interceptor (automatically adds JWT to requests)
 *
 * INTERCEPTORS:
 *   Interceptors are middleware for HTTP requests/responses.
 *   They run before every request or after every response.
 *
 *   Request interceptor: Adds the Authorization header
 *     Before: { url: '/api/tasks' }
 *     After:  { url: '/api/tasks', headers: { Authorization: 'Bearer eyJ...' } }
 *
 *   Response interceptor (optional): Handle 401 errors globally
 *     If the server says "unauthorized", we can auto-logout the user.
 *
 * WHY A SEPARATE FILE?
 *   - DRY: Configure once, use everywhere
 *   - Consistency: Every API call gets the auth header
 *   - Maintainability: Change the base URL in one place
 *   - Testability: Easy to mock in tests
 * =============================================================
 */

import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  // In development, Vite's proxy forwards /api requests to the backend.
  // In production, you'd set this to your actual API URL.
  // Using an empty string means requests go to the same origin.
  baseURL: '',

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
  },

  // Request timeout (10 seconds)
  timeout: 10000,
});

/**
 * REQUEST INTERCEPTOR
 *
 * Runs before every outgoing request.
 * If a JWT token exists in localStorage, add it to the
 * Authorization header as a Bearer token.
 *
 * The server expects: Authorization: Bearer <token>
 *
 * This pattern means:
 *   - You never need to manually add the token to requests
 *   - Every API call is automatically authenticated
 *   - If the user is logged out (no token), no header is added
 */
apiClient.interceptors.request.use(
  (config) => {
    // Read the token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // Add the Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // If something goes wrong configuring the request, reject it
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR (Optional but recommended)
 *
 * Runs after every response from the server.
 * We use it to handle 401 (Unauthorized) errors globally.
 *
 * If the server returns 401, it means our token is invalid or expired.
 * Instead of handling this in every component, we handle it here once.
 */
apiClient.interceptors.response.use(
  // Success handler - just pass the response through
  (response) => response,

  // Error handler - check for 401
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - clear it
      localStorage.removeItem('authToken');

      // Optionally redirect to login page
      // We check if we're not already on the login page to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
