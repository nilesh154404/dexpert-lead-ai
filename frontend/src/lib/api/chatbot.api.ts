import { apiClient } from '../api-client';

export interface ChatbotLeadSubmission {
  organisationId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  message?: string;
}

export const chatbotApi = {
  submitLead: async (data: ChatbotLeadSubmission) => {
    // This endpoint doesn't require auth, so we'll call it directly
    return apiClient.post('/leads/chatbot', data);
  },
};
