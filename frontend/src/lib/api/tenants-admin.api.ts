import { apiClient } from '../api-client';

export interface TenantBranding {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  logo?: string | null;
  logomark?: string | null;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string | null;
  welcomeMessage?: string | null;
  chatbotName?: string | null;
  chatbotAvatar?: string | null;
}


export interface CreateTenantDto {
  name: string;
  logo?: string;
  logomark?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  welcomeMessage?: string;
  chatbotName?: string;
  chatbotAvatar?: string;
}

export interface UpdateTenantDto {
  name?: string;
  logo?: string;
  logomark?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  welcomeMessage?: string;
  chatbotName?: string;
  chatbotAvatar?: string;
}

export interface TenantsListResponse {
  data: TenantBranding[];
  total: number;
}

// Admin-level tenant management API
export const tenantsAdminApi = {
  /**
   * Get all tenants (SUPER_ADMIN only)
   */
  getAll: async (): Promise<TenantsListResponse> => {
    return apiClient.get<TenantsListResponse>('/tenants');
  },

  /**
   * Get a specific tenant by ID
   */
  getById: async (id: string): Promise<TenantBranding> => {
    return apiClient.get<TenantBranding>(`/tenants/${id}`);
  },

  /**
   * Create a new tenant (SUPER_ADMIN only)
   */
  create: async (data: CreateTenantDto): Promise<TenantBranding> => {
    return apiClient.post<TenantBranding>('/tenants', data);
  },

  /**
   * Update a tenant (SUPER_ADMIN only)
   */
  update: async (id: string, data: UpdateTenantDto): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>(`/tenants/${id}`, data);
  },

  /**
   * Delete a tenant (SUPER_ADMIN only)
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/tenants/${id}`);
  },
};

// User-level tenant API (get own tenant)
export const tenantsApi = {
  getCurrent: async (): Promise<TenantBranding> => {
    return apiClient.get<TenantBranding>('/tenants/me');
  },

  update: async (data: UpdateTenantDto): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>('/tenants/me', data);
  },
};
