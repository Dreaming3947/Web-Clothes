import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'buyer' | 'seller';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:8000/backend/api';

// Session management constants
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const REMEMBER_ME_KEY = 'rememberMe';
const SESSION_CHECK_INTERVAL = 60000; // Check every 1 minute
const TOKEN_REFRESH_THRESHOLD = 300000; // Refresh 5 minutes before expiry

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh token before expiry
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!token || !expiry) return;

      const expiryTime = parseInt(expiry);
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      // Refresh token if less than 5 minutes until expiry
      if (timeUntilExpiry > 0 && timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Auto token refresh failed:', error);
          logout();
        }
      } else if (timeUntilExpiry <= 0) {
        // Token expired
        logout();
      }
    };

    const interval = setInterval(checkAndRefreshToken, SESSION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Check session validity on visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        
        if (token && expiry) {
          const expiryTime = parseInt(expiry);
          if (Date.now() >= expiryTime) {
            logout();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (token && storedUser && expiry) {
      const expiryTime = parseInt(expiry);
      
      // Check if token is still valid
      if (Date.now() < expiryTime) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired, clear storage
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.full_name,
        role: data.data.user.role,
        avatar: data.data.user.avatar,
        phone: data.data.user.phone,
      };

      setUser(userData);
      
      // Store tokens and expiry
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
      
      // Calculate and store token expiry
      const expiryTime = Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      // Store refresh token if provided
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.name,
          phone: data.phone,
          role: data.role || 'buyer',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      const userData: User = {
        id: result.data.user.id,
        email: result.data.user.email,
        name: result.data.user.full_name,
        role: result.data.user.role,
        phone: data.phone,
      };

      setUser(userData);
      localStorage.setItem(TOKEN_KEY, result.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      if (result.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
      const currentToken = localStorage.getItem(TOKEN_KEY);
      
      if (!refreshTokenValue && !currentToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_URL}/auth.php?action=refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ 
          refreshToken: refreshTokenValue 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update tokens
      localStorage.setItem(TOKEN_KEY, data.data.token);
      
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const expiryTime = Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
      }

      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthData();
    
    // Optional: Call backend to invalidate session
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch(`${API_URL}/auth.php?action=logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(() => {
        // Ignore errors on logout
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      const response = await fetch(`${API_URL}/auth.php?action=update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: data.name,
          phone: data.phone,
          avatar: data.avatar,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Update failed');
      }

      // Update local state with response data
      const updatedUser: User = {
        id: result.data.user.id,
        email: result.data.user.email,
        name: result.data.user.full_name,
        role: result.data.user.role,
        avatar: result.data.user.avatar,
        phone: result.data.user.phone,
      };

      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
