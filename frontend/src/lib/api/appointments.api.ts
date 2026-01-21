import { apiClient } from '../api-client';

export interface Appointment {
  id: string;
  adminId?: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
  leadId?: string;
  lead?: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  staffId?: string;
  staff?: {
    id: string;
    name: string;
    email: string;
    role: string;
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
  title: string;
  date: string;
  time: string;
  duration: string;
  type?: 'video' | 'phone' | 'in-person';
  status?: 'scheduled' | 'completed' | 'cancelled';
  aiNote?: string;
  aiSuggested?: boolean;
}

export interface AvailableSlot {
  date: string;
  time: string;
  availableStaff: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  bookedStaff: Array<{
    staff: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    bookedBy: {
      appointmentId: string;
      leadName: string;
      leadId: string;
    };
  }>;
  totalStaff: number;
  availableCount: number;
  bookedCount: number;
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

  getAvailableSlots: async (date?: string): Promise<AvailableSlot[]> => {
    return apiClient.get<AvailableSlot[]>('/appointments/available-slots', {
      params: date ? { date } : {},
    });
  },
};
