// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

// Create the Auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('toms_token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('toms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  // Login that communicates with backend /auth/login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const payload = response.data?.data || response.data;
      const authToken = payload?.token || payload?.accessToken;
      const authUser = payload?.user || payload?.userInfo;

      if (!authToken) {
        throw new Error('No authentication token received from server.');
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('toms_token', authToken);
      if (authUser) {
        localStorage.setItem('toms_user', JSON.stringify(authUser));
      }
      return { success: true };
    } catch (err) {
      console.error('Login error', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please verify your credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('toms_token');
    localStorage.removeItem('toms_user');
  };

  // Re-fetch current user profile when token is present
  useEffect(() => {
    if (token) {
      apiClient
        .get('/auth/me')
        .then((res) => {
          const profile = res.data?.data || res.data;
          setUser(profile);
          if (profile) {
            localStorage.setItem('toms_user', JSON.stringify(profile));
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            logout();
          }
        });
    }
  }, [token]);

  const getToken = () => token;

  const hasRole = (allowedRoles = []) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        loading,
        getToken,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export const useAuth = () => useContext(AuthContext);
