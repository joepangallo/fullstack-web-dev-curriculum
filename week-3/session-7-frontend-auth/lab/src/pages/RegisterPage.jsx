/**
 * =============================================================
 * REGISTER PAGE - New User Registration Form
 * =============================================================
 *
 * Similar to LoginPage but collects additional fields (username)
 * and includes a password confirmation field for better UX.
 *
 * KEY CONCEPTS:
 *   - Client-side validation before making API calls
 *   - Password confirmation pattern
 *   - Reusing the same AuthContext pattern as LoginPage
 *   - Automatic login after successful registration
 *
 * VALIDATION LAYERS:
 *   1. HTML5 validation (required, type="email", minLength)
 *   2. JavaScript validation (password match, custom rules)
 *   3. Server-side validation (the backend is the final authority)
 *   All three layers work together for robust validation.
 * =============================================================
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  // Form field state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  /**
   * Validate form fields before submitting.
   * Returns an error message string, or empty string if valid.
   *
   * Client-side validation provides instant feedback.
   * The server still validates everything - this is just UX.
   */
  function validateForm() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      return 'Please fill in all fields';
    }

    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return ''; // No errors
  }

  /**
   * Handle form submission.
   * Validates input, calls register(), navigates on success.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Run client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call register() from AuthContext
      // This creates the account AND logs the user in automatically
      await register(username.trim(), email.trim(), password);

      // Registration successful - go to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Show server error (e.g., "Email already registered")
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed. Please try again.';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              minLength={3}
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          {/* Confirm password field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type your password again"
              required
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
