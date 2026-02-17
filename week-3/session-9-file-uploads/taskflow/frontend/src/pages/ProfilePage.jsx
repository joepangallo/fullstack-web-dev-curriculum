/**
 * =============================================================
 * PROFILE PAGE - User Profile with Avatar Upload
 * =============================================================
 *
 * Displays the user's profile information and allows them
 * to upload or change their avatar image.
 *
 * KEY CONCEPTS:
 *   - Fetching user profile data from the API (separate from JWT data)
 *   - File upload with FormData
 *   - Image preview before upload
 *   - Component composition (ProfilePage uses AvatarUpload)
 *
 * DATA FLOW:
 *   1. On mount: Fetch profile data from GET /api/users/profile
 *   2. Display user info and current avatar
 *   3. AvatarUpload component handles file selection and upload
 *   4. After successful upload, refresh profile data
 *
 * WHY FETCH PROFILE SEPARATELY FROM JWT?
 *   The JWT contains basic user info (id, username, email) that
 *   was set at login time. But the avatar URL can change after
 *   login. Fetching the profile gives us the latest data.
 * =============================================================
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import AvatarUpload from '../components/AvatarUpload';

function ProfilePage() {
  const { user } = useAuth();

  // Profile data from the API (may be more up-to-date than JWT)
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch the user's profile from the API.
   * This includes avatar URL and task count which aren't in the JWT.
   */
  async function fetchProfile() {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.get('/api/users/profile');
      setProfile(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to load profile.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  /**
   * Called by AvatarUpload after a successful avatar upload.
   * Updates the profile state with the new avatar URL
   * without needing to refetch from the API.
   *
   * @param {string} newAvatarUrl - The URL of the newly uploaded avatar
   */
  function handleAvatarChange(newAvatarUrl) {
    setProfile((prev) => ({
      ...prev,
      avatarUrl: newAvatarUrl,
    }));
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">{error}</div>
        <button onClick={fetchProfile} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card">
        {/* Avatar section with upload component */}
        <div className="profile-avatar-section">
          <AvatarUpload
            currentAvatarUrl={profile?.avatarUrl}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        {/* User information */}
        <div className="profile-info">
          <div className="profile-field">
            <label>Username</label>
            <p>{profile?.username || user.username}</p>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <p>{profile?.email || user.email}</p>
          </div>

          <div className="profile-field">
            <label>Member Since</label>
            <p>
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>

          <div className="profile-field">
            <label>Total Tasks</label>
            <p>{profile?.taskCount ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
