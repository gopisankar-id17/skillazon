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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3003/api/auth';

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        console.log('Token found in localStorage, fetching user profile...');
        await fetchUserProfile();
      } else {
        console.log('No token found in localStorage');
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []); // Remove fetchUserProfile dependency to avoid infinite loop

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found');
        setLoading(false);
        return;
      }

      console.log('Fetching user profile with token...');
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setUser(data.user);
        setLoading(false);
      } else {
        console.log('Profile fetch failed, attempting token refresh...');
        // Token might be expired, try to refresh
        await refreshToken();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('No refresh token found, logging out...');
        logout();
        return;
      }

      console.log('Attempting to refresh token...');
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      console.log('Refresh token response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Token refreshed successfully');
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        await fetchUserProfile();
      } else {
        console.log('Token refresh failed, logging out...');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, confirmPassword })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('Initiating logout process...');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        console.log('Notifying server of logout...');
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      console.log('Clearing local storage and user state...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
