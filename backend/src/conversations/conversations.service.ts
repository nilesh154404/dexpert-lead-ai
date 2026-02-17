// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Conversation } from '../entities/conversation.entity';
// import { Message } from '../entities/message.entity';
// import { Lead } from '../entities/lead.entity';
// import { CreateConversationDto } from './dto/create-conversation.dto';
// import { UpdateConversationDto } from './dto/update-conversation.dto';
// import { CreateMessageDto } from './dto/create-message.dto';

// @Injectable()
// export class ConversationsService {
//   constructor(
//     @InjectRepository(Conversation)
//     private conversationRepository: Repository<Conversation>,
//     @InjectRepository(Message)
//     private messageRepository: Repository<Message>,
//     @InjectRepository(Lead)
//     private leadRepository: Repository<Lead>,
//   ) {}

//   async create(createConversationDto: CreateConversationDto, tenantId: string): Promise<Conversation> {
//     const lead = await this.leadRepository.findOne({
//       where: { id: createConversationDto.leadId, tenantId },
//     });

//     if (!lead) {
//       throw new NotFoundException(`Lead with ID ${createConversationDto.leadId} not found`);
//     }

//     const conversation = this.conversationRepository.create({
//       ...createConversationDto,
//       tenantId,
//     });

//     const savedConversation = await this.conversationRepository.save(conversation);

//     // Update lead's last interaction
//     lead.lastInteractionAt = new Date();
//     await this.leadRepository.save(lead);

//     return savedConversation;
//   }

//   async findAll(tenantId: string, leadId?: string) {
//     const queryBuilder = this.conversationRepository
//       .createQueryBuilder('conversation')
//       .leftJoinAndSelect('conversation.lead', 'lead')
//       .leftJoinAndSelect('conversation.messages', 'messages')
//       .where('conversation.tenantId = :tenantId', { tenantId });

//     if (leadId) {
//       queryBuilder.andWhere('conversation.leadId = :leadId', { leadId });
//     }

//     queryBuilder.orderBy('conversation.createdAt', 'DESC');

//     return queryBuilder.getMany();
//   }

//   async findOne(id: string, tenantId: string): Promise<Conversation> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id, tenantId },
//       relations: ['lead', 'messages'],
//     });

//     if (!conversation) {
//       throw new NotFoundException(`Conversation with ID ${id} not found`);
//     }

//     return conversation;
//   }

//   async update(id: string, updateConversationDto: UpdateConversationDto, tenantId: string): Promise<Conversation> {
//     const conversation = await this.findOne(id, tenantId);
//     Object.assign(conversation, updateConversationDto);
//     return this.conversationRepository.save(conversation);
//   }

//   async remove(id: string, tenantId: string): Promise<void> {
//     const conversation = await this.findOne(id, tenantId);
//     await this.conversationRepository.remove(conversation);
//   }

//   async addMessage(createMessageDto: CreateMessageDto, tenantId: string): Promise<Message> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id: createMessageDto.conversationId, tenantId },
//     });

//     if (!conversation) {
//       throw new NotFoundException(`Conversation with ID ${createMessageDto.conversationId} not found`);
//     }

//     const message = this.messageRepository.create(createMessageDto);
//     const savedMessage = await this.messageRepository.save(message);

//     // Update lead's last interaction
//     const lead = await this.leadRepository.findOne({
//       where: { id: conversation.leadId },
//     });

//     if (lead) {
//       lead.lastInteractionAt = new Date();
//       await this.leadRepository.save(lead);
//     }

//     return savedMessage;
//   }

//   async getMessages(conversationId: string, tenantId: string): Promise<Message[]> {
//     const conversation = await this.findOne(conversationId, tenantId);
//     return conversation.messages || [];
//   }
// }


// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Conversation } from '../entities/conversation.entity';
// import { Message } from '../entities/message.entity';
// import { Lead } from '../entities/lead.entity';
// import { CreateConversationDto } from './dto/create-conversation.dto';
// import { UpdateConversationDto } from './dto/update-conversation.dto';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { ConversationsGateway } from './conversations.gateway';


// @Injectable()
// export class ConversationsService {
//   constructor(
//     @InjectRepository(Conversation)
//     private readonly conversationRepository: Repository<Conversation>,

//     @InjectRepository(Message)
//     private readonly messageRepository: Repository<Message>,

//     @InjectRepository(Lead)
//     private readonly leadRepository: Repository<Lead>,

//     private gateway: ConversationsGateway,  //io

//   ) {}

//   /* ================= CREATE CONVERSATION ================= */
//   async create(
//     dto: CreateConversationDto,
//     tenantId: string,
//   ): Promise<Conversation> {
//     const lead = await this.leadRepository.findOne({
//       where: { id: dto.leadId, tenantId },
//     });

//     if (!lead) {
//       throw new NotFoundException('Lead not found');
//     }

//     const conversation = this.conversationRepository.create({
//       ...dto,
//       tenantId,
//     });

//     const saved = await this.conversationRepository.save(conversation);

//     lead.lastInteractionAt = new Date();
//     await this.leadRepository.save(lead);

//     return saved;
//   }

//   /* ================= LIST CONVERSATIONS (LEFT PANEL) ================= */
//   async findAll(tenantId: string, leadId?: string) {
//     const query = this.conversationRepository
//       .createQueryBuilder('conversation')
//       .leftJoinAndSelect('conversation.lead', 'lead')
//       .where('conversation.tenantId = :tenantId', { tenantId });

//     if (leadId) {
//       // query.andWhere('conversation.leadId = :leadId', { leadId });
//         query.andWhere('lead.id = :leadId', { leadId });

//     }

//     query.orderBy('conversation.updatedAt', 'DESC');

//     return query.getMany();
//   }

//   /* ================= SINGLE CONVERSATION ================= */
//   async findOne(id: string, tenantId: string): Promise<Conversation> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id, tenantId },
//       relations: ['lead'],
//     });

//     if (!conversation) {
//       throw new NotFoundException('Conversation not found');
//     }

//     return conversation;
//   }

//   /* ================= GET MESSAGES (RIGHT PANEL) ================= */
//   async getMessages(conversationId: string, tenantId: string): Promise<Message[]> {
//     // tenant safety check
//     await this.findOne(conversationId, tenantId);

//     return this.messageRepository.find({
//       where: { conversationId },
//       order: { createdAt: 'ASC' },
//     });
//   }

//   /* ================= ADD MESSAGE (CHATBOT ONLY) ================= */
//   async addMessage(
//     dto: CreateMessageDto,
//     tenantId: string,
//   ): Promise<Message> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id: dto.conversationId, tenantId },
//     });

//     if (!conversation) {
//       throw new NotFoundException('Conversation not found');
//     }

//     const message = this.messageRepository.create(dto);
//     const saved = await this.messageRepository.save(message);

//     const lead = await this.leadRepository.findOne({
//       where: { id: conversation.leadId },
//     });

//     if (lead) {
//       lead.lastInteractionAt = new Date();
//       await this.leadRepository.save(lead);
//     }

//     return saved;
//   }

//   /* ================= UPDATE REVIEW STATUS ================= */
//   async update(
//     id: string,
//     dto: UpdateConversationDto,
//     tenantId: string,
//   ): Promise<Conversation> {
//     const conversation = await this.findOne(id, tenantId);
//     Object.assign(conversation, dto);
//     return this.conversationRepository.save(conversation);
//   }

//   /* ================= DELETE ================= */
//   async remove(id: string, tenantId: string): Promise<void> {
//     const conversation = await this.findOne(id, tenantId);
//     await this.conversationRepository.remove(conversation);
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import axios from 'axios';


import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { Lead } from '../entities/lead.entity';
import { ChatAuthDto } from './dto/chat-auth.dto';
import { MessageRole } from '../entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserRole } from '../entities/user.entity';
import { User } from '../entities/user.entity';

import { ConversationsGateway } from './conversations.gateway';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,

    // ✅ SOCKET GATEWAY
    private readonly gateway: ConversationsGateway,
  ) {}

  
  /* ================= CREATE CONVERSATION ================= */
  async create(
    dto: CreateConversationDto,
    tenantId: string,
  ): Promise<Conversation> {
    const lead = await this.leadRepository.findOne({
      where: { id: dto.leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const conversation = this.conversationRepository.create({
      ...dto,
      tenantId,
    });

    const savedConversation =
      await this.conversationRepository.save(conversation);

    // 🔥 SOCKET EVENT: NEW CONVERSATION
    this.gateway.emitConversationCreated(savedConversation);

    // Update lead interaction
    lead.lastInteractionAt = new Date();
    await this.leadRepository.save(lead);

    return savedConversation;
  }

  /* ================= LIST CONVERSATIONS ================= */
  // async findAll(tenantId: string, leadId?: string) {
  //   const query = this.conversationRepository
  //     .createQueryBuilder('conversation')
  //     .leftJoinAndSelect('conversation.lead', 'lead')
  //     .where('conversation.tenantId = :tenantId', { tenantId });

  //   if (leadId) {
  //     query.andWhere('lead.id = :leadId', { leadId });
  //   }

  //   query.orderBy('conversation.updatedAt', 'DESC');

  //   return query.getMany();
  // }

async findAll(
  user: User,
  leadId?: string,
) {
  const query = this.conversationRepository
    .createQueryBuilder('conversation')
    .leftJoinAndSelect('conversation.lead', 'lead');

  // ✅ ADMIN → tenant restriction
  if (user.role !== UserRole.SUPER_ADMIN) {
    query.where('conversation.tenantId = :tenantId', {
      tenantId: user.tenantId,
    });
  }

  // optional lead filter
  if (leadId) {
    query.andWhere('conversation.leadId = :leadId', { leadId });
  }

  query.orderBy('conversation.updatedAt', 'DESC');

  return query.getMany();
}



  /* ================= SINGLE CONVERSATION ================= */
  async findOne(id: string, tenantId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id, tenantId },
      relations: ['lead'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /* ================= GET MESSAGES ================= */
  // async getMessages(
  //   conversationId: string,
  //   tenantId: string,
  // ): Promise<Message[]> {
  //   await this.findOne(conversationId, tenantId);

  //   return this.messageRepository.find({
  //     where: { conversationId },
  //     order: { createdAt: 'ASC' },
  //   });
  // }

  async getMessages(
  conversationId: string,
  user: User,
): Promise<Message[]> {

  if (user.role === UserRole.SUPER_ADMIN) {
    // 🔓 Super admin can read messages from ANY tenant
    return this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  // 🔒 Normal admin → tenant check
  const conversation = await this.conversationRepository.findOne({
    where: {
      id: conversationId,
      tenantId: user.tenantId,
    },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  return this.messageRepository.find({
    where: { conversationId },
    order: { createdAt: 'ASC' },
  });
}


  /* ================= ADD MESSAGE (CHATBOT ONLY) ================= */
  // async addMessage(
  //   dto: CreateMessageDto,
  //   tenantId: string,
  // ): Promise<Message> {
  //   const conversation = await this.conversationRepository.findOne({
  //     where: { id: dto.conversationId, tenantId },
  //   });

  //   if (!conversation) {
  //     throw new NotFoundException('Conversation not found');
  //   }

  //   const message = this.messageRepository.create(dto);
  //   const savedMessage = await this.messageRepository.save(message);

  //   // 🔥 SOCKET EVENT: NEW MESSAGE
  //   this.gateway.emitMessageCreated(savedMessage);

  //   const lead = await this.leadRepository.findOne({
  //     where: { id: conversation.leadId },
  //   });

  //   if (lead) {
  //     lead.lastInteractionAt = new Date();
  //     await this.leadRepository.save(lead);
  //   }

  //   return savedMessage;
  // }

  async addMessage(
  dto: CreateMessageDto,
  tenantId: string,
): Promise<Message> {
  const conversation = await this.conversationRepository.findOne({
    where: { id: dto.conversationId, tenantId },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  const message = this.messageRepository.create(dto);
  const saved = await this.messageRepository.save(message);

  // update lead last interaction
  const lead = await this.leadRepository.findOne({
    where: { id: conversation.leadId },
  });

  if (lead) {
    lead.lastInteractionAt = new Date();
    await this.leadRepository.save(lead);
  }

  // 🔥 SOCKET EVENT
  this.gateway.emitMessageCreated(saved);

  return saved;
}


  /* ================= UPDATE REVIEW ================= */
  async update(
    id: string,
    dto: UpdateConversationDto,
    tenantId: string,
  ): Promise<Conversation> {
    const conversation = await this.findOne(id, tenantId);
    Object.assign(conversation, dto);
    return this.conversationRepository.save(conversation);
  }

  /* ================= DELETE ================= */
  async remove(id: string, tenantId: string): Promise<void> {
    const conversation = await this.findOne(id, tenantId);
    await this.conversationRepository.remove(conversation);
  }


//   async addChatbotMessage(dto: ChatAuthDto): Promise<Message> {
//   const conversation = await this.conversationRepository.findOne({
//     where: {
//       id: dto.conversation_id,
//       tenantId: dto.tenant_id,
//     },
//   });

//   if (!conversation) {
//     throw new NotFoundException('Conversation not found for tenant');
//   }

//   const message = this.messageRepository.create({
//     conversationId: dto.conversation_id,
//     role: 'ai',
//     content: dto.content,
//   });

//   const saved = await this.messageRepository.save(message);

//   // 🔥 SOCKET EVENT
//   this.gateway.emitMessageCreated(saved);

//   return saved;
// }

async addChatbotMessage(dto: ChatAuthDto): Promise<Message> {
  const conversation = await this.conversationRepository.findOne({
    where: {
      id: dto.conversationId,
      tenantId: dto.tenantId,
    },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  const message = this.messageRepository.create({
    conversationId: dto.conversationId,
    role: dto.role, // MessageRole.AI
    content: dto.content,
    aiInsightType: dto.aiInsightType,
    aiInsightLabel: dto.aiInsightLabel,
    aiInsightConfidence: dto.aiInsightConfidence,
  });

  const saved = await this.messageRepository.save(message);

  // update lead activity
  const lead = await this.leadRepository.findOne({
    where: { id: conversation.leadId },
  });

  if (lead) {
    lead.lastInteractionAt = new Date();
    await this.leadRepository.save(lead);
  }

  // 🔥 REAL-TIME UPDATE
  this.gateway.emitMessageCreated(saved);

  return saved;
}

}
