/**
 * =============================================================
 * LOGIN PAGE - User Authentication Form
 * =============================================================
 *
 * A controlled form that collects email and password, then calls
 * the login() function from AuthContext.
 *
 * KEY CONCEPTS:
 *   - Controlled inputs: React state drives the input values
 *   - Form submission: preventDefault() stops the page from reloading
 *   - Error handling: Display server errors to the user
 *   - Loading state: Disable form while request is in progress
 *   - Redirect after login: Navigate to dashboard (or previous page)
 *
 * CONTROLLED vs UNCONTROLLED INPUTS:
 *   Controlled: value={email} + onChange={setEmail}
 *     - React owns the data, input reflects state
 *     - Easier to validate, transform, and submit
 *   Uncontrolled: uses ref to read DOM value directly
 *     - Simpler but harder to work with
 *
 * We use controlled inputs here (the standard React pattern).
 * =============================================================
 */

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  // Form field state - controlled inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [error, setError] = useState('');       // Error message to display
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where to redirect after login (default: /dashboard)
  // If user was redirected FROM a protected page, go back there
  const redirectTo = location.state?.from || '/dashboard';

  /**
   * Handle form submission.
   *
   * FLOW:
   *   1. Prevent default form behavior (page reload)
   *   2. Clear any previous errors
   *   3. Call login() from AuthContext
   *   4. On success: navigate to dashboard
   *   5. On failure: show error message
   */
  async function handleSubmit(event) {
    // Prevent the browser's default form submission (full page reload)
    event.preventDefault();

    // Clear previous error
    setError('');

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Set loading state to disable form during request
    setIsSubmitting(true);

    try {
      // Call the login function from AuthContext
      // This makes the API call, stores the token, and updates state
      await login(email, password);

      // Success! Navigate to the dashboard (or previous page)
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Extract a user-friendly error message
      // Axios wraps the response in err.response.data
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';

      setError(message);
    } finally {
      // Always stop the loading state, whether success or failure
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {/* Error display - only shows when error state is set */}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {/*
          onSubmit fires when the form is submitted
          (either by clicking the button or pressing Enter)
        */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email input - controlled by email state */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required       // HTML5 validation (backup to our JS validation)
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          {/* Password input - controlled by password state */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit button - disabled while request is in progress */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to registration page */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
