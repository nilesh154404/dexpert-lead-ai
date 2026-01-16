import { apiClient } from '../api-client';

export interface DashboardStats {
  totalLeads: {
    value: number;
    change: number;
  };
  totalConversations: {
    value: number;
    change: number;
  };
  totalAppointments: {
    value: number;
    change: number;
  };
  conversionRate: {
    value: number;
    change: number;
  };
}

export interface LeadSource {
  name: string;
  value: number;
  count: number;
}

export interface LeadsOverTime {
  month: string;
  leads: number;
  aiGenerated: number;
}

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/analytics/dashboard');
  },

  getLeadSources: async (): Promise<LeadSource[]> => {
    return apiClient.get<LeadSource[]>('/analytics/lead-sources');
  },

  getLeadsOverTime: async (months: number = 6): Promise<LeadsOverTime[]> => {
    return apiClient.get<LeadsOverTime[]>('/analytics/leads-over-time', {
      params: { months },
    });
  },
};
