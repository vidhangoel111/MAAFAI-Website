import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'maaai_token';
const USER_KEY = 'maaai_user';
const ROLE_KEY = 'maaai_role';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    const savedRole = localStorage.getItem(ROLE_KEY);
    if (savedToken && savedUser && savedRole) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ROLE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, userRole = 'student') => {
    setUser(userData);
    setToken(authToken);
    setRole(userRole);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(ROLE_KEY, userRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    isAuthenticated: !!user,
    isStudent: role === 'student',
    isAdmin: role === 'admin',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
