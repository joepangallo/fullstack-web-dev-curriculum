/**
 * =============================================================
 * AUTH CONTEXT - Centralized Authentication State Management
 * =============================================================
 *
 * This module implements the Context + Provider pattern for auth.
 * Instead of passing user data through props at every level
 * ("prop drilling"), we create a context that any component can
 * access directly with the useAuth() hook.
 *
 * ARCHITECTURE:
 *   AuthContext (created with createContext)
 *     -> AuthProvider (component that holds state + logic)
 *       -> useAuth() hook (easy access for consumers)
 *
 * STATE:
 *   - user: { id, username, email } or null
 *   - token: JWT string or null
 *   - isLoading: true while checking stored token on mount
 *
 * FLOW:
 *   1. On mount: check localStorage for a saved token
 *   2. If token exists: decode it to restore user state
 *   3. login(): call API, store token, update state
 *   4. register(): call API, store token, update state
 *   5. logout(): clear everything
 *
 * JWT DECODING:
 *   We decode the JWT payload (middle segment) client-side
 *   to extract user info. This is NOT verification - the server
 *   verifies the signature. We just read the payload for display.
 * =============================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

// Step 1: Create the context object
// This creates a "channel" that Provider and consumers share
const AuthContext = createContext(null);

/**
 * Decode a JWT token to extract the payload.
 *
 * JWTs have three parts separated by dots: header.payload.signature
 * The payload (middle part) is base64url-encoded JSON containing
 * user data like { id, username, email, iat, exp }.
 *
 * IMPORTANT: This does NOT verify the token's signature.
 * Verification happens on the server. Client-side decoding
 * is only for reading the payload data.
 *
 * @param {string} token - The JWT string
 * @returns {object|null} - Decoded payload or null if invalid
 */
function decodeToken(token) {
  try {
    // Split token into parts: [header, payload, signature]
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    // atob() decodes base64 strings in the browser
    // We also handle base64url encoding (replace - and _ chars)
    const payload = parts[1]
      .replace(/-/g, '+')   // base64url -> base64
      .replace(/_/g, '/');  // base64url -> base64

    const decoded = JSON.parse(atob(payload));

    // Check if token is expired
    // exp is in seconds, Date.now() is in milliseconds
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token has expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * AuthProvider Component
 *
 * Wraps the application and provides authentication state
 * to all child components via context.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // Authentication state
  const [user, setUser] = useState(null);       // Current user object
  const [token, setToken] = useState(null);      // JWT token string
  const [isLoading, setIsLoading] = useState(true); // Loading while checking stored auth

  /**
   * On mount: Check localStorage for a previously stored token.
   * If found and valid, restore the user session without requiring
   * a new login. This is what makes "remember me" work.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      const decoded = decodeToken(storedToken);

      if (decoded) {
        // Token is valid - restore the session
        setToken(storedToken);
        setUser({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
        });
      } else {
        // Token is invalid or expired - clean up
        localStorage.removeItem('authToken');
      }
    }

    // Done checking - stop showing loading state
    setIsLoading(false);
  }, []); // Empty dependency array = runs once on mount

  /**
   * Log in with email and password.
   *
   * Sends credentials to the backend, receives a JWT token,
   * stores it in localStorage, and updates React state.
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} - The decoded user data
   * @throws {Error} - If login fails
   */
  async function login(email, password) {
    // POST credentials to the auth endpoint
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    const { token: newToken } = response.data;

    // Decode the token to get user info
    const decoded = decodeToken(newToken);
    if (!decoded) {
      throw new Error('Received invalid token from server');
    }

    // Persist token in localStorage (survives page refresh)
    localStorage.setItem('authToken', newToken);

    // Update React state (triggers re-renders in consuming components)
    setToken(newToken);
    const userData = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    setUser(userData);

    return userData;
  }

  /**
   * Register a new user account.
   *
   * Creates the account on the backend, receives a JWT token,
   * and automatically logs the user in.
   *
   * @param {string} username - Desired username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} - The decoded user data
   * @throws {Error} - If registration fails
   */
  async function register(username, email, password) {
    const response = await apiClient.post('/api/auth/register', {
      username,
      email,
      password,
    });

    const { token: newToken } = response.data;

    const decoded = decodeToken(newToken);
    if (!decoded) {
      throw new Error('Received invalid token from server');
    }

    // Same flow as login - store token and update state
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    const userData = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    setUser(userData);

    return userData;
  }

  /**
   * Log out the current user.
   *
   * Clears the stored token and resets React state.
   * Any component watching auth state will re-render
   * (e.g., Header will show Login instead of Logout).
   */
  function logout() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }

  // The value object is what consumers receive from useAuth()
  // Include state AND functions so consumers can both read
  // auth state and trigger auth actions
  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    // Provide the auth value to all children in the tree
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook - Convenient access to auth context.
 *
 * Usage in any component:
 *   const { user, login, logout } = useAuth();
 *
 * This is a custom hook that wraps useContext with a safety check.
 * If someone tries to use useAuth() outside of an AuthProvider,
 * we throw a helpful error instead of returning undefined.
 *
 * @returns {object} - Auth state and functions
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth() must be used within an <AuthProvider>. ' +
      'Make sure your component tree is wrapped with AuthProvider.'
    );
  }

  return context;
}

export default AuthContext;
