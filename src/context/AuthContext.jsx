import React, { createContext, useContext, useState } from 'react';
import users from '../data/users.json';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = users.find(
      u => u.username === username && u.password === password
    );
    if (found) setUser(found);
    return !!found;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);