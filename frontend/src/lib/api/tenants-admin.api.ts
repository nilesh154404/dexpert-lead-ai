import { apiClient } from '../api-client';

/**
 * =========================
 * TYPES
 * =========================
 */

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

  /** 🔴 REQUIRED FOR STATUS TOGGLE */
  status: 'active' | 'inactive';

  /** 🟢 UI convenience flag */
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
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

/**
 * =========================
 * ADMIN TENANT API
 * =========================
 */

export const tenantsAdminApi = {
  /**
   * Get all tenants (SUPER_ADMIN)
   */
  getAll: async (): Promise<TenantsListResponse> => {
    return apiClient.get<TenantsListResponse>('/tenants');
  },

  /**
   * Get tenant by ID
   */
  getById: async (id: string): Promise<TenantBranding> => {
    return apiClient.get<TenantBranding>(`/tenants/${id}`);
  },

  /**
   * Create tenant
   */
  create: async (data: CreateTenantDto): Promise<TenantBranding> => {
    return apiClient.post<TenantBranding>('/tenants', data);
  },

  /**
   * Update tenant branding (NOT status)
   */
  update: async (
    id: string,
    data: UpdateTenantDto
  ): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>(`/tenants/${id}`, data);
  },

  /**
   * 🔴 DEACTIVATE tenant
   */
  deactivate: async (id: string): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>(
      `/tenants/${id}/deactivate`
    );
  },

  /**
   * 🟢 ACTIVATE tenant
   */
  activate: async (id: string): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>(
      `/tenants/${id}/activate`
    );
  },
};

/**
 * =========================
 * USER TENANT API
 * =========================
 */

export const tenantsApi = {
  getCurrent: async (): Promise<TenantBranding> => {
    return apiClient.get<TenantBranding>('/tenants/me');
  },

  update: async (
    data: UpdateTenantDto
  ): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>('/tenants/me', data);
  },
};
