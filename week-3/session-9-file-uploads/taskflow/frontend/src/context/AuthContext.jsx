/**
 * =============================================================
 * AUTH CONTEXT - Same as Session 8
 * =============================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setToken(storedToken);
        setUser({ id: decoded.id, username: decoded.username, email: decoded.email });
      } else {
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email, password) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { token: newToken } = response.data;
    const decoded = decodeToken(newToken);
    if (!decoded) throw new Error('Invalid token');
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    const userData = { id: decoded.id, username: decoded.username, email: decoded.email };
    setUser(userData);
    return userData;
  }

  async function register(username, email, password) {
    const response = await apiClient.post('/api/auth/register', { username, email, password });
    const { token: newToken } = response.data;
    const decoded = decodeToken(newToken);
    if (!decoded) throw new Error('Invalid token');
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    const userData = { id: decoded.id, username: decoded.username, email: decoded.email };
    setUser(userData);
    return userData;
  }

  function logout() {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth() must be used within <AuthProvider>');
  return context;
}

export default AuthContext;
