import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const ADMIN_ACCOUNT = {
  role: 'SUPER_ADMIN',
  label: 'Admin',
  email: 'kilaparthimohan27@gmail.com',
  name: 'Mohan Kilaparthi',
  title: 'Administrator & Executive Leader'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme');
  }, []);

  // Verify token validity on mount or refresh admin session cleanly
  useEffect(() => {
    const verifyOrLogin = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.me();
          if (res && (res.success || res.data)) {
            setUser(res.data || res);
            setToken(storedToken);
            return;
          }
        } catch (e) {
          console.warn('Stored session invalid or expired. Re-authenticating with fresh Admin credentials.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      login('kilaparthimohan27@gmail.com', 'Naidu 1234')
        .catch(() => login('admin@enterprise.com', 'Naidu 1234'))
        .catch(() => {});
    };

    verifyOrLogin();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    if (!user) return false;
    if (!user.roles) return true; // Single admin user default
    return user.roles.includes('SUPER_ADMIN') || user.roles.includes('HR_ADMIN') || user.roles.includes('ADMIN');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        theme: 'light',
        loading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
