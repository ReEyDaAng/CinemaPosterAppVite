import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedAccess = localStorage.getItem('accessToken');
    if (storedAccess) {
      try {
        setAccessToken(storedAccess);
        const decoded = jwtDecode(storedAccess);
        setUser({ username: decoded.username, ...decoded });
      } catch (error) {
        logout();
      }
    }
  }, []);

  async function authFetch(url, opts = {}) {
    const res = await fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        ...opts.headers,
      },
      credentials: 'include',
    });
    
    if (res.status === 401 && url !== '/api/auth/refresh') {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshRes.ok) {
        const { accessToken: newAccess } = await refreshRes.json();
        localStorage.setItem('accessToken', newAccess);
        setAccessToken(newAccess);
        
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
        logout();
        throw new Error('Сесія завершилась. Будь ласка, увійдіть знову.');
      }
    }
    return res;
  }

  async function login({ username, password }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    
    if (!res.ok) return false;
    
    const { accessToken: at } = await res.json();
    localStorage.setItem('accessToken', at);
    setAccessToken(at);
    
    const decoded = jwtDecode(at);
    setUser({ username: decoded.username, ...decoded });
    return true;
  }

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
    
    return login({ username, password });
  }

  async function logout() {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error); 
  }

  return (
    <AuthContext.Provider value={{ user, login, register, accessToken, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}