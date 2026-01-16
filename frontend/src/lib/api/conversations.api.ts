import { apiClient } from '../api-client';

export interface Message {
  id: string;
  conversationId: string;
  role: 'lead' | 'ai' | 'human';
  content: string;
  aiInsightType?: 'intent' | 'sentiment' | 'topic' | 'objection';
  aiInsightLabel?: string;
  aiInsightConfidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  lead?: {
    id: string;
    name: string;
    email: string;
  };
  summary?: string;
  intentScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  aiAccuracy: 'accurate' | 'needs-improvement' | 'pending';
  humanCorrection?: string;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  leadId: string;
  summary?: string;
  intentScore?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  aiAccuracy?: 'accurate' | 'needs-improvement' | 'pending';
}

export interface CreateMessageDto {
  conversationId: string;
  role: 'lead' | 'ai' | 'human';
  content: string;
  aiInsightType?: 'intent' | 'sentiment' | 'topic' | 'objection';
  aiInsightLabel?: string;
  aiInsightConfidence?: number;
}

export const conversationsApi = {
  getAll: async (leadId?: string): Promise<Conversation[]> => {
    return apiClient.get<Conversation[]>('/conversations', {
      params: leadId ? { leadId } : {},
    });
  },

  getById: async (id: string): Promise<Conversation> => {
    return apiClient.get<Conversation>(`/conversations/${id}`);
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    return apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
  },

  create: async (data: CreateConversationDto): Promise<Conversation> => {
    return apiClient.post<Conversation>('/conversations', data);
  },

  addMessage: async (data: CreateMessageDto): Promise<Message> => {
    return apiClient.post<Message>('/conversations/messages', data);
  },

  update: async (id: string, data: Partial<CreateConversationDto> & { humanCorrection?: string }): Promise<Conversation> => {
    return apiClient.patch<Conversation>(`/conversations/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/conversations/${id}`);
  },
};
