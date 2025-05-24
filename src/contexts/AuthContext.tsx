import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../api';
import type { AxiosError } from 'axios';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount and handle expired sessions
  useEffect(() => {
    if (user && location.pathname !== '/login') {
      // Verify the session is still valid
      auth.login({ name: user.name, email: user.email }).catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        }
      });
    }
  }, []);

  const login = useCallback(async (name: string, email: string) => {
    try {
      await auth.login({ name, email });
      const newUser = { name, email };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Get the redirect path from location state or default to /search
      const from = (location.state as { from?: Location })?.from?.pathname || '/search';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [navigate, location]);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state, even if the API call fails
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 