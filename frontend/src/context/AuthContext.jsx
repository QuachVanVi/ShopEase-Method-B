import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('user') || null);

  const login = (username) => {
    localStorage.setItem('user', username);
    setUser(username);
    // Force a full page reload to clear all state contexts
    window.location.href = '/';
  };

  const logout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Logout failed', err);
    }
    localStorage.removeItem('user');
    setUser(null);
    // Force a full page reload to a clean slate
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
