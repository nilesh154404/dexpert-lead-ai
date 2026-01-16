import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { LeadInsight } from '../entities/lead-insight.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { CreateLeadChatbotDto } from './dto/create-lead-chatbot.dto';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(LeadInsight)
    private insightRepository: Repository<LeadInsight>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(createLeadDto: CreateLeadDto, tenantId: string): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...createLeadDto,
      tenantId,
      lastInteractionAt: new Date(),
    });

    return this.leadRepository.save(lead);
  }

  async findAll(query: LeadQueryDto, tenantId: string, userRole?: UserRole) {
    const { search, status, intentRange, assignedToId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.assignedTo', 'assignedTo')
      .leftJoinAndSelect('lead.tenant', 'tenant')
      .orderBy('lead.createdAt', 'DESC');

    // SUPER_ADMIN can see all leads, others only their tenant
    if (userRole !== UserRole.SUPER_ADMIN) {
      queryBuilder.where('lead.tenantId = :tenantId', { tenantId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(lead.name LIKE :search OR lead.email LIKE :search OR lead.company LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('lead.status = :status', { status });
    }

    if (intentRange) {
      if (intentRange === 'hot') {
        queryBuilder.andWhere('lead.intentScore >= :min', { min: 85 });
      } else if (intentRange === 'warm') {
        queryBuilder.andWhere('lead.intentScore >= :min AND lead.intentScore < :max', {
          min: 70,
          max: 85,
        });
      } else if (intentRange === 'cool') {
        queryBuilder.andWhere('lead.intentScore >= :min AND lead.intentScore < :max', {
          min: 50,
          max: 70,
        });
      }
    }

    if (assignedToId) {
      queryBuilder.andWhere('lead.assignedToId = :assignedToId', { assignedToId });
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string, userRole?: UserRole): Promise<Lead> {
    const whereCondition: any = { id };
    
    if (userRole !== UserRole.SUPER_ADMIN) {
      whereCondition.tenantId = tenantId;
    }

    const lead = await this.leadRepository.findOne({
      where: whereCondition,
      relations: ['assignedTo', 'appointments', 'conversations', 'insights', 'tenant'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, tenantId: string, userRole?: UserRole): Promise<Lead> {
    const lead = await this.findOne(id, tenantId, userRole);

    Object.assign(lead, updateLeadDto);
    if (updateLeadDto.status || updateLeadDto.intentScore) {
      lead.lastInteractionAt = new Date();
    }

    return this.leadRepository.save(lead);
  }

  async remove(id: string, tenantId: string, userRole?: UserRole): Promise<void> {
    const lead = await this.findOne(id, tenantId, userRole);
    await this.leadRepository.remove(lead);
  }

  async getHotLeads(tenantId: string, limit: number = 5, userRole?: UserRole): Promise<Lead[]> {
    const whereCondition: any = {
      intentScore: Between(85, 100),
    };

    if (userRole !== UserRole.SUPER_ADMIN) {
      whereCondition.tenantId = tenantId;
    }

    return this.leadRepository.find({
      where: whereCondition,
      relations: ['assignedTo'],
      order: {
        intentScore: 'DESC',
        lastInteractionAt: 'DESC',
      },
      take: limit,
    });
  }

  async createFromChatbot(createLeadChatbotDto: CreateLeadChatbotDto): Promise<Lead> {
    // Verify organisation exists
    const tenant = await this.tenantRepository.findOne({
      where: { id: createLeadChatbotDto.organisationId },
    });

    if (!tenant) {
      throw new NotFoundException(`Organisation with ID ${createLeadChatbotDto.organisationId} not found`);
    }

    // Create lead from chatbot submission
    const lead = this.leadRepository.create({
      name: createLeadChatbotDto.name,
      email: createLeadChatbotDto.email,
      phone: createLeadChatbotDto.phone,
      company: createLeadChatbotDto.company,
      role: createLeadChatbotDto.role,
      tenantId: createLeadChatbotDto.organisationId,
      status: 'new' as any,
      source: 'AI Chatbot',
      intentScore: 0, // Can be calculated by AI later
      aiSummary: createLeadChatbotDto.message || 'New lead from chatbot',
      lastInteractionAt: new Date(),
    });

    return this.leadRepository.save(lead);
  }
}
