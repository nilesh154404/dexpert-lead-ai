import { apiClient } from '../api-client';

export interface Appointment {
  id: string;
  leadId: string;
  lead?: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  aiNote?: string;
  aiSuggested?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  leadId: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type?: 'video' | 'phone' | 'in-person';
  status?: 'scheduled' | 'completed' | 'cancelled';
  aiNote?: string;
  aiSuggested?: boolean;
}

export const appointmentsApi = {
  getAll: async (startDate?: string, endDate?: string): Promise<Appointment[]> => {
    return apiClient.get<Appointment[]>('/appointments', {
      params: { startDate, endDate },
    });
  },

  getByLead: async (leadId: string): Promise<Appointment[]> => {
    return apiClient.get<Appointment[]>(`/appointments/lead/${leadId}`);
  },

  getById: async (id: string): Promise<Appointment> => {
    return apiClient.get<Appointment>(`/appointments/${id}`);
  },

  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    return apiClient.post<Appointment>('/appointments', data);
  },

  update: async (id: string, data: Partial<CreateAppointmentDto>): Promise<Appointment> => {
    return apiClient.patch<Appointment>(`/appointments/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/appointments/${id}`);
  },
};
