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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { CreateLeadChatbotDto } from './dto/create-lead-chatbot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../entities/user.entity';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('chatbot')
  @Public()
  @ApiOperation({ summary: 'Create a lead from chatbot (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Lead successfully created from chatbot' })
  @ApiResponse({ status: 404, description: 'Organisation not found' })
  createFromChatbot(@Body() createLeadChatbotDto: CreateLeadChatbotDto) {
    return this.leadsService.createFromChatbot(createLeadChatbotDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead successfully created' })
  create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user: User) {
    return this.leadsService.create(createLeadDto, user.tenantId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all leads with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of leads' })
  findAll(@Query() query: LeadQueryDto, @CurrentUser() user: User) {
    return this.leadsService.findAll(query, user.tenantId, user.role);
  }

  @Get('hot')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get hot leads (intent score >= 85)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of leads to return' })
  @ApiResponse({ status: 200, description: 'Returns list of hot leads' })
  getHotLeads(@Query('limit') limit: number, @CurrentUser() user: User) {
    return this.leadsService.getHotLeads(user.tenantId, limit, user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a lead by ID' })
  @ApiResponse({ status: 200, description: 'Returns the lead' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.leadsService.findOne(id, user.tenantId, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ status: 200, description: 'Lead successfully updated' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: User,
  ) {
    return this.leadsService.update(id, updateLeadDto, user.tenantId, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 200, description: 'Lead successfully deleted' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.leadsService.remove(id, user.tenantId, user.role);
  }
}
