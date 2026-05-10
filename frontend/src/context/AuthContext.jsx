import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('user') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (username, userToken) => {
    localStorage.setItem('user', username);
    localStorage.setItem('token', userToken);
    // Force a full page reload to clear all state contexts (like wishlist shadows)
    window.location.href = '/';
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Force a full page reload to a clean slate
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
