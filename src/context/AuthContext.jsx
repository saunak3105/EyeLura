
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('eyelura-token');
      if (savedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('eyelura-token');
            localStorage.removeItem('eyelura-user');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('eyelura-token');
          localStorage.removeItem('eyelura-user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Check for Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const token = urlParams.get('token');

    if (authStatus === 'success' && token) {
      localStorage.setItem('eyelura-token', token);
      // Remove the query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reinitialize auth to get user data
      initializeAuth();
    } else if (authStatus === 'failed') {
      console.error('Google authentication failed');
      // Remove the query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token } = data.data;
        setUser(user);
        localStorage.setItem('eyelura-token', token);
        localStorage.setItem('eyelura-user', JSON.stringify(user));
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user, token } = data.data;
        setUser(user);
        localStorage.setItem('eyelura-token', token);
        localStorage.setItem('eyelura-user', JSON.stringify(user));
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const googleSignIn = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('eyelura-token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('eyelura-token');
      localStorage.removeItem('eyelura-user');
    }
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('eyelura-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    googleSignIn,
    logout,
    isAuthModalOpen,
    authMode,
    setAuthMode,
    openAuthModal,
    closeAuthModal,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
