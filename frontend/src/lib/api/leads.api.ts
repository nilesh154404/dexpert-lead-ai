import { apiClient } from '../api-client';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: 'new' | 'qualified' | 'nurturing' | 'converted' | 'lost';
  intentScore: number;
  confidenceScore?: number;
  source?: string;
  aiSummary?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  lastInteractionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadQueryParams {
  search?: string;
  status?: string;
  intentRange?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

export interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const leadsApi = {
  getAll: async (params?: LeadQueryParams): Promise<LeadsResponse> => {
    return apiClient.get<LeadsResponse>('/leads', { params });
  },

  getById: async (id: string): Promise<Lead> => {
    return apiClient.get<Lead>(`/leads/${id}`);
  },

  getHotLeads: async (limit: number = 5): Promise<Lead[]> => {
    return apiClient.get<Lead[]>('/leads/hot', { params: { limit } });
  },

  create: async (data: Partial<Lead>): Promise<Lead> => {
    return apiClient.post<Lead>('/leads', data);
  },

  update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    return apiClient.patch<Lead>(`/leads/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/leads/${id}`);
  },
};
