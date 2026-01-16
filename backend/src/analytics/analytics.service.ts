import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead, LeadStatus } from '../entities/lead.entity';
import { Conversation } from '../entities/conversation.entity';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getDashboardStats(tenantId: string, userRole?: UserRole) {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const whereCondition: any = {};
    if (userRole !== UserRole.SUPER_ADMIN) {
      whereCondition.tenantId = tenantId;
    }

    // Total leads
    const totalLeads = await this.leadRepository.count({
      where: whereCondition,
    });

    const lastMonthLeads = await this.leadRepository.count({
      where: {
        ...whereCondition,
        createdAt: Between(lastMonth, now),
      },
    });

    // AI Conversations
    const totalConversations = await this.conversationRepository.count({
      where: whereCondition,
    });

    const lastMonthConversations = await this.conversationRepository.count({
      where: {
        ...whereCondition,
        createdAt: Between(lastMonth, now),
      },
    });

    // Appointments
    let appointmentsQuery = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.lead', 'lead')
      .where('appointment.status = :status', { status: AppointmentStatus.SCHEDULED });

    if (userRole !== UserRole.SUPER_ADMIN) {
      appointmentsQuery = appointmentsQuery.andWhere('lead.tenantId = :tenantId', { tenantId });
    }

    const appointments = await appointmentsQuery.getCount();

    // Conversion rate
    const convertedLeads = await this.leadRepository.count({
      where: {
        ...whereCondition,
        status: LeadStatus.CONVERTED,
      },
    });

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Calculate changes
    const leadsChange = lastMonthLeads > 0 ? ((totalLeads - lastMonthLeads) / lastMonthLeads) * 100 : 0;
    const conversationsChange =
      lastMonthConversations > 0
        ? ((totalConversations - lastMonthConversations) / lastMonthConversations) * 100
        : 0;

    return {
      totalLeads: {
        value: totalLeads,
        change: leadsChange,
      },
      totalConversations: {
        value: totalConversations,
        change: conversationsChange,
      },
      totalAppointments: {
        value: appointments,
        change: 0,
      },
      conversionRate: {
        value: conversionRate,
        change: 0,
      },
    };
  }

  async getLeadSources(tenantId: string, userRole?: UserRole) {
    const whereCondition: any = {};
    if (userRole !== UserRole.SUPER_ADMIN) {
      whereCondition.tenantId = tenantId;
    }

    const leads = await this.leadRepository.find({
      where: whereCondition,
      select: ['source'],
    });

    const sourceCounts = leads.reduce((acc, lead) => {
      const source = lead.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = leads.length;
    return Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      count,
    }));
  }

  async getLeadsOverTime(tenantId: string, months: number = 6, userRole?: UserRole) {
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);

      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);

      const whereCondition: any = {
        createdAt: Between(date, nextMonth),
      };
      if (userRole !== UserRole.SUPER_ADMIN) {
        whereCondition.tenantId = tenantId;
      }

      const leadsCount = await this.leadRepository.count({
        where: whereCondition,
      });

      const aiGeneratedCount = await this.leadRepository.count({
        where: {
          ...whereCondition,
          source: 'AI Chatbot',
        },
      });

      data.push({
        month: date.toLocaleString('default', { month: 'short' }),
        leads: leadsCount,
        aiGenerated: aiGeneratedCount,
      });
    }

    return data;
  }
}
