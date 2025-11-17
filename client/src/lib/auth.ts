/**
 * Secure Authentication Utilities
 * 
 * SECURITY NOTES:
 * - Tokens are stored in localStorage (consider httpOnly cookies for production)
 * - Always validate tokens on the server side
 * - Implement token refresh mechanism
 * - Use HTTPS in production
 */

interface User {
  id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  firstName?: string;
  lastName?: string;
}

interface AuthTokens {
  token: string;
  user: User;
}

// Token storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/**
 * Store authentication tokens securely
 */
export const setAuthTokens = (tokens: AuthTokens): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(TOKEN_KEY, tokens.token);
    localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
  } catch (error) {
    console.error('Error storing auth tokens:', error);
  }
};

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get stored user data
 */
export const getStoredUser = (): User | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthTokens = (): void => {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getStoredUser();
  return !!(token && user);
};

/**
 * Get authorization headers for API requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Check if token is expired (basic check - server should validate)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    return true; // If we can't parse, assume expired
  }
};

/**
 * Validate user role
 */
export const hasRole = (requiredRole: User['role']): boolean => {
  const user = getStoredUser();
  return user?.role === requiredRole;
};

/**
 * Validate user has any of the specified roles
 */
export const hasAnyRole = (roles: User['role'][]): boolean => {
  const user = getStoredUser();
  return user ? roles.includes(user.role) : false;
};
