// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConversationsController } from './conversations.controller';
// import { ConversationsService } from './conversations.service';
// import { Conversation } from '../entities/conversation.entity';
// import { Message } from '../entities/message.entity';
// import { Lead } from '../entities/lead.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Conversation, Message, Lead])],
//   controllers: [ConversationsController],
//   providers: [ConversationsService],
//   exports: [ConversationsService],
// })
// export class ConversationsModule {}


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConversationsController } from './conversations.controller';
// import { ConversationsService } from './conversations.service';
// import { Conversation } from '../entities/conversation.entity';
// import { Message } from '../entities/message.entity';
// import { Lead } from '../entities/lead.entity';
// import { ConversationsGateway } from './conversations.gateway';

// @Module({
//   imports: [TypeOrmModule.forFeature([Conversation, Message, Lead])],
//   controllers: [ConversationsController],
//   providers: [ConversationsService, ConversationsGateway],
// })
// export class ConversationsModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConversationsGateway } from './conversations.gateway';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { Lead } from '../entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Lead])],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsGateway],
  exports: [ConversationsService],
})
export class ConversationsModule {}
