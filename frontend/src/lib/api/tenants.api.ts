import { apiClient } from '../api-client';

export interface TenantBranding {
  id: string;
  name: string;
  email:string;
  
  logo?: string;
  logomark?: string;
  primaryColor: string;
  accentColor: string;
  fontFamily?: string;
  welcomeMessage?: string;
  chatbotName?: string;
  chatbotAvatar?: string;
  createdAt: string;
  updatedAt: string;
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

export const tenantsApi = {
  getCurrent: async (): Promise<TenantBranding> => {
    return apiClient.get<TenantBranding>('/tenants/me');
  },

  update: async (data: UpdateTenantDto): Promise<TenantBranding> => {
    return apiClient.patch<TenantBranding>('/tenants/me', data);
  },

  getAllTenants: async () => {
    const response = await apiClient.get('/tenants');
    return response.data;
  },
  
};



