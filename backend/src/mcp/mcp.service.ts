import { Injectable } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ConversationsService } from '../conversations/conversations.service';
import { User } from '../entities/user.entity';

@Injectable()
export class MCPService {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly conversationsService: ConversationsService,
  ) {}

  /* =========================
      LEADS
  ========================= */

  async createLead(args: any) {
    const { tenantId, ...dto } = args;
    return this.leadsService.create(dto, tenantId);
  }

  async listLeads(args: any) {
    const { tenantId, query = {}, role } = args;

    return this.leadsService.findAll(
      query,
      tenantId,
      role,
    );
  }

  async getHotLeads(args: any) {
    const { tenantId, limit = 5, role } = args;

    return this.leadsService.getHotLeads(
      tenantId,
      limit,
      role,
    );
  }

  async createChatbotLead(args: any) {
    return this.leadsService.createFromChatbot(args);
  }

  async getLead(args: any) {
    const { id, tenantId, role } = args;

    return this.leadsService.findOne(
      id,
      tenantId,
      role,
    );
  }

  async updateLead(args: any) {
    const { id, tenantId, role, ...dto } = args;

    return this.leadsService.update(
      id,
      dto,
      tenantId,
      role,
    );
  }

  async deleteLead(args: any) {
    const { id, tenantId, role } = args;

    return this.leadsService.remove(
      id,
      tenantId,
      role,
    );
  }

  /* =========================
      APPOINTMENTS
  ========================= */

  async createAppointment(args: any) {
    const { tenantId, userId, ...dto } = args;

    return this.appointmentsService.create(
      dto,
      tenantId,
      userId,
    );
  }

  async listAppointments(args: any) {
    const { tenantId, role, userId, startDate, endDate } = args;

    return this.appointmentsService.findAll(
      tenantId,
      role,
      userId,
      startDate,
      endDate,
    );
  }

  async getAppointment(args: any) {
    const { id, tenantId, role, userId } = args;

    return this.appointmentsService.findOne(
      id,
      tenantId,
      role,
      userId,
    );
  }

  async updateAppointment(args: any) {
    const { id, tenantId, role, userId, ...dto } = args;

    return this.appointmentsService.update(
      id,
      dto,
      tenantId,
      role,
      userId,
    );
  }

  async deleteAppointment(args: any) {
    const { id, tenantId, role, userId } = args;

    return this.appointmentsService.remove(
      id,
      tenantId,
      role,
      userId,
    );
  }

  async getAvailableSlots(args: any) {
    const { tenantId, date } = args;

    return this.appointmentsService.getAvailableSlots(
      tenantId,
      date,
    );
  }

  async getAppointmentsByLead(args: any) {
    const { leadId, tenantId, role, userId } = args;

    return this.appointmentsService.findByLead(
      leadId,
      tenantId,
      role,
      userId,
    );
  }

  /* =========================
      CONVERSATIONS
  ========================= */

  async createConversation(args: any) {
    const { tenantId, ...dto } = args;

    return this.conversationsService.create(
      dto,
      tenantId,
    );
  }

  async listConversations(args: any) {
    const { user, leadId } = args;

    return this.conversationsService.findAll(
      user,
      leadId,
    );
  }

  async getConversation(args: any) {
    const { id, tenantId } = args;

    return this.conversationsService.findOne(
      id,
      tenantId,
    );
  }

  async getMessages(args: any) {
    const { conversationId, user } = args;

    return this.conversationsService.getMessages(
      conversationId,
      user as User,
    );
  }

  async addMessage(args: any) {
    const { tenantId, ...dto } = args;

    return this.conversationsService.addMessage(
      dto,
      tenantId,
    );
  }

  async addChatbotMessage(args: any) {
    return this.conversationsService.addChatbotMessage(args);
  }

  async updateConversation(args: any) {
    const { id, tenantId, ...dto } = args;

    return this.conversationsService.update(
      id,
      dto,
      tenantId,
    );
  }

  async deleteConversation(args: any) {
    const { id, tenantId } = args;

    return this.conversationsService.remove(
      id,
      tenantId,
    );
  }
}