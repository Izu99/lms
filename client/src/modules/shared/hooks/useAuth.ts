import { useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/user.types';

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial server render

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initAuth = () => {
        try {
          const token = localStorage.getItem('token');
          const savedUser = localStorage.getItem('user');

          if (token && savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } finally {
          setIsLoading(false);
        }
      };
      initAuth();
    } else {
      setIsLoading(false); // On server, assume not loading after initial render
    }
  }, []);

  const login = (token: string, userData: AuthUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    setUser(null);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    login,
    logout,
  };
};