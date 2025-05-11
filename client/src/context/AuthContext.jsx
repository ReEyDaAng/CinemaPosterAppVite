import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Fixed import

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Only load accessToken from localStorage
  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken');
    if (storedAccess) {
      try {
        setAccessToken(storedAccess);
        const decoded = jwtDecode(storedAccess);
        setUser({ username: decoded.username, ...decoded });
      } catch (error) {
        // Invalid token
        logout();
      }
    }
  }, []);

  // Fetch with token and auto-refresh
  async function authFetch(url, opts = {}) {
    // First try with current access token
    const res = await fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        ...opts.headers,
      },
      credentials: 'include', // Important for cookies
    });
    
    // If unauthorized and not already trying to refresh
    if (res.status === 401 && url !== '/api/auth/refresh') {
      // Try to refresh the token
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // For the refresh cookie
      });
      
      if (refreshRes.ok) {
        const { accessToken: newAccess } = await refreshRes.json();
        localStorage.setItem('accessToken', newAccess);
        setAccessToken(newAccess);
        
        // Retry original request with new token
        return fetch(url, {
          ...opts,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccess}`,
            ...opts.headers,
          },
          credentials: 'include',
        });
      } else {
        // If refresh fails, log out
        logout();
        throw new Error('Сесія завершилась. Будь ласка, увійдіть знову.');
      }
    }
    return res;
  }

  // Login function
  async function login({ username, password }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Important for receiving cookies
    });
    
    if (!res.ok) return false;
    
    const { accessToken: at } = await res.json();
    localStorage.setItem('accessToken', at);
    setAccessToken(at);
    
    const decoded = jwtDecode(at);
    setUser({ username: decoded.username, ...decoded });
    return true;
  }

  // Register function
  async function register({ username, email, password, confirm }) {
    if (password !== confirm) {
      throw new Error('Паролі не співпадають');
    }
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirm }),
      credentials: 'include',
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Не вдалося зареєструватися');
    }
    
    // After successful registration, try to login
    return login({ username, password });
  }

  // Logout function
  async function logout() {
    // Clear local state
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    
    // Call logout endpoint to invalidate refresh token
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // For the cookie
    }).catch(console.error); // Ignore errors on logout
  }

  return (
    <AuthContext.Provider value={{ user, login, register, accessToken, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}