import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { Lead } from '../entities/lead.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createConversationDto: CreateConversationDto, tenantId: string): Promise<Conversation> {
    const lead = await this.leadRepository.findOne({
      where: { id: createConversationDto.leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${createConversationDto.leadId} not found`);
    }

    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      tenantId,
    });

    const savedConversation = await this.conversationRepository.save(conversation);

    // Update lead's last interaction
    lead.lastInteractionAt = new Date();
    await this.leadRepository.save(lead);

    return savedConversation;
  }

  async findAll(tenantId: string, leadId?: string) {
    const queryBuilder = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lead', 'lead')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .where('conversation.tenantId = :tenantId', { tenantId });

    if (leadId) {
      queryBuilder.andWhere('conversation.leadId = :leadId', { leadId });
    }

    queryBuilder.orderBy('conversation.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string, tenantId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id, tenantId },
      relations: ['lead', 'messages'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto, tenantId: string): Promise<Conversation> {
    const conversation = await this.findOne(id, tenantId);
    Object.assign(conversation, updateConversationDto);
    return this.conversationRepository.save(conversation);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const conversation = await this.findOne(id, tenantId);
    await this.conversationRepository.remove(conversation);
  }

  async addMessage(createMessageDto: CreateMessageDto, tenantId: string): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: createMessageDto.conversationId, tenantId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${createMessageDto.conversationId} not found`);
    }

    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);

    // Update lead's last interaction
    const lead = await this.leadRepository.findOne({
      where: { id: conversation.leadId },
    });

    if (lead) {
      lead.lastInteractionAt = new Date();
      await this.leadRepository.save(lead);
    }

    return savedMessage;
  }

  async getMessages(conversationId: string, tenantId: string): Promise<Message[]> {
    const conversation = await this.findOne(conversationId, tenantId);
    return conversation.messages || [];
  }
}
