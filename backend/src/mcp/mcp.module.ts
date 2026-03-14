import { Module } from '@nestjs/common';
import { LeadsModule } from '../leads/leads.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MCPService } from './mcp.service';
import { MCPController } from './mcp.controller';

@Module({
  imports: [
    LeadsModule,
    AppointmentsModule,
    ConversationsModule,
  ],
  providers: [MCPService],
  controllers: [MCPController],
})
export class MCPModule {}