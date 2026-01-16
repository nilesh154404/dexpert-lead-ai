import { apiClient } from '../api-client';

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationRuleDto {
  name: string;
  description: string;
  enabled?: boolean;
  condition: string;
  action: string;
}

export const aiConfigApi = {
  getAllRules: async (): Promise<AutomationRule[]> => {
    return apiClient.get<AutomationRule[]>('/ai-config/rules');
  },

  getRuleById: async (id: string): Promise<AutomationRule> => {
    return apiClient.get<AutomationRule>(`/ai-config/rules/${id}`);
  },

  createRule: async (data: CreateAutomationRuleDto): Promise<AutomationRule> => {
    return apiClient.post<AutomationRule>('/ai-config/rules', data);
  },

  updateRule: async (id: string, data: Partial<CreateAutomationRuleDto>): Promise<AutomationRule> => {
    return apiClient.patch<AutomationRule>(`/ai-config/rules/${id}`, data);
  },

  deleteRule: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/ai-config/rules/${id}`);
  },
};
