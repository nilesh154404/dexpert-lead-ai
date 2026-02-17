// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
//   ApiQuery,
// } from '@nestjs/swagger';
// import { ConversationsService } from './conversations.service';
// import { CreateConversationDto } from './dto/create-conversation.dto';
// import { UpdateConversationDto } from './dto/update-conversation.dto';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { User } from '../entities/user.entity';

// @ApiTags('conversations')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
// @Controller('conversations')
// export class ConversationsController {
//   constructor(private readonly conversationsService: ConversationsService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new conversation' })
//   @ApiResponse({ status: 201, description: 'Conversation successfully created' })
//   create(@Body() createConversationDto: CreateConversationDto, @CurrentUser() user: User) {
//     return this.conversationsService.create(createConversationDto, user.tenantId);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all conversations' })
//   @ApiQuery({ name: 'leadId', required: false, description: 'Filter by lead ID' })
//   @ApiResponse({ status: 200, description: 'Returns list of conversations' })
//   findAll(@Query('leadId') leadId: string, @CurrentUser() user: User) {
//     return this.conversationsService.findAll(user.tenantId, leadId);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a conversation by ID' })
//   @ApiResponse({ status: 200, description: 'Returns the conversation' })
//   @ApiResponse({ status: 404, description: 'Conversation not found' })
//   findOne(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.conversationsService.findOne(id, user.tenantId);
//   }

//   @Get(':id/messages')
//   @ApiOperation({ summary: 'Get messages for a conversation' })
//   @ApiResponse({ status: 200, description: 'Returns list of messages' })
//   getMessages(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.conversationsService.getMessages(id, user.tenantId);
//   }

//   @Post('messages')
//   @ApiOperation({ summary: 'Add a message to a conversation' })
//   @ApiResponse({ status: 201, description: 'Message successfully created' })
//   addMessage(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: User) {
//     return this.conversationsService.addMessage(createMessageDto, user.tenantId);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a conversation' })
//   @ApiResponse({ status: 200, description: 'Conversation successfully updated' })
//   @ApiResponse({ status: 404, description: 'Conversation not found' })
//   update(
//     @Param('id') id: string,
//     @Body() updateConversationDto: UpdateConversationDto,
//     @CurrentUser() user: User,
//   ) {
//     return this.conversationsService.update(id, updateConversationDto, user.tenantId);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a conversation' })
//   @ApiResponse({ status: 200, description: 'Conversation successfully deleted' })
//   @ApiResponse({ status: 404, description: 'Conversation not found' })
//   remove(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.conversationsService.remove(id, user.tenantId);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { ChatAuthDto } from './dto/chat-auth.dto';



@ApiTags('conversations')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a conversation (chatbot only)' })
  create(
    @Body() dto: CreateConversationDto,
    @CurrentUser() user: User,
  ) {
    return this.service.create(dto, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get conversations for tenant' })
  @ApiQuery({ name: 'leadId', required: false })
  findAll(
    @Query('leadId') leadId: string,
    @CurrentUser() user: User,
  ) {
    // return this.service.findAll(user.tenantId, leadId);
      return this.service.findAll(user, leadId);

  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.service.findOne(id, user.tenantId);
  }

  // @Get(':id/messages')
  // getMessages(
  //   @Param('id') id: string,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.service.getMessages(id, user.tenantId);
  // }

  @Get(':id/messages')
getMessages(
  @Param('id') id: string,
  @CurrentUser() user: User,
) {
  return this.service.getMessages(id, user);
}


  @Post('messages')
  addMessage(
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: User,
  ) {
    return this.service.addMessage(dto, user.tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(id, dto, user.tenantId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.service.remove(id, user.tenantId);
  }

  @Post('chat-auth')
@ApiOperation({ summary: 'Chatbot → Add AI message (no user auth)' })
@ApiResponse({ status: 201 })
async chatAuth(@Body() dto: ChatAuthDto) {
  return this.service.addChatbotMessage(dto);
}

 

}
