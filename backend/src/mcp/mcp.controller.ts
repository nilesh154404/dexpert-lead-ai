import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MCPService } from './mcp.service';
import { MCPApiKeyGuard } from './guards/mcp-api-key.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@UseGuards(MCPApiKeyGuard)
@Controller('mcp')
export class MCPController {
  constructor(private readonly mcpService: MCPService) {}

  @Post('tool')
  async executeTool(
    @Body()
    body: {
      tool: string;
      args: any;
    },
  ) {
    const { tool, args } = body;

    if (!tool) {
      throw new BadRequestException('Tool name is required');
    }

    switch (tool) {
      /* ================= LEADS ================= */

      case 'create_lead':
        return this.mcpService.createLead(args);

      case 'list_leads':
        return this.mcpService.listLeads(args);

      case 'get_hot_leads':
        return this.mcpService.getHotLeads(args);

      case 'create_chatbot_lead':
        return this.mcpService.createChatbotLead(args);

      /* ================= APPOINTMENTS ================= */

      case 'create_appointment':
        return this.mcpService.createAppointment(args);

      case 'available_slots':
        return this.mcpService.getAvailableSlots(args);

      /* ================= CONVERSATIONS ================= */

      case 'add_message':
        return this.mcpService.addMessage(args);

      case 'get_messages':
        return this.mcpService.getMessages(args);

      default:
        throw new BadRequestException(`Unknown MCP tool: ${tool}`);
    }
  }
}