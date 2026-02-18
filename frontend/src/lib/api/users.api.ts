import { apiClient } from '../api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'support';
  department?: string;
  status: 'active' | 'invited' | 'inactive';
  tenantId: string;
  assignedLeads?: any[];
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'sales' | 'support';
  department?: string;
  status?: 'active' | 'invited' | 'inactive';
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return apiClient.get<User[]>('/users');
  },

  getById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // create: async (data: CreateUserDto): Promise<User> => {
  //   return apiClient.post<User>('/users', data);
  // },

//   create: async (data: Omit<CreateUserDto, "password">): Promise<User> => {
//   return apiClient.post<User>('/users', {
//     ...data,

//     // ✅ REQUIRED BY BACKEND
//     password: 'password123',

//     // ✅ SAFE DEFAULTS
//     status: data.status ?? 'active',

//     // ✅ MATCH BACKEND ENUM
//     role: data.role?.toUpperCase(),
//   });
// },

create: async (data: {
  name: string;
  email: string;
  role: string;
  department?: string;
}): Promise<User> => {
  return apiClient.post<User>('/users', {
    name: data.name,
    email: data.email,
    // ✅ DEFAULT STAFF PASSWORD
    password: 'password123',
    // ✅ MATCH BACKEND ENUM VALUE (lowercase)
    role: data.role.toLowerCase(),
    department: data.department,
    // ✅ SAFE DEFAULT
    status: 'active',
  });
},



  update: async (id: string, data: Partial<CreateUserDto>): Promise<User> => {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}`);
  },
};
