import { apiClient } from '../api-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  tenantId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'organisation' | 'admin' | 'manager' | 'sales' | 'support';
  department?: string;
  status: 'active' | 'invited' | 'inactive';
  tenantId: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  status?: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
