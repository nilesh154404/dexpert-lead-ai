import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '@/lib/api/auth.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setToken(response.access_token);
    const userData: User = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role as User['role'],
      tenantId: response.tenantId,
      status: response.status as any,
      department: response.department,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
    setUser(userData);
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    setToken(response.access_token);
    const userData: User = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role as User['role'],
      tenantId: response.tenantId,
      status: response.status as any,
      department: response.department,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
    setUser(userData);
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
