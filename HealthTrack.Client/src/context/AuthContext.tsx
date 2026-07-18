import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

// Define what our context will contain
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

// Create the context (like setting up the central security system)
const AuthContext = createContext<AuthContextType | null>(null);

// Provider wraps the whole app and gives everyone access
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // When app loads, check if user was already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isAdmin = () => user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — makes it easy to use auth from any component
// Instead of useContext(AuthContext) everywhere, just useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};