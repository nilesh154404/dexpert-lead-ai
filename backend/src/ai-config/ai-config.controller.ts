import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiConfigService } from './ai-config.service';
import { CreateAutomationRuleDto } from './dto/create-automation-rule.dto';
import { UpdateAutomationRuleDto } from './dto/update-automation-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('ai-config')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ai-config')
export class AiConfigController {
  constructor(private readonly aiConfigService: AiConfigService) {}

  @Post('rules')
  @ApiOperation({ summary: 'Create an automation rule' })
  @ApiResponse({ status: 201, description: 'Rule successfully created' })
  create(@Body() createRuleDto: CreateAutomationRuleDto, @CurrentUser() user: User) {
    return this.aiConfigService.create(createRuleDto, user.tenantId);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all automation rules' })
  @ApiResponse({ status: 200, description: 'Returns list of automation rules' })
  findAll(@CurrentUser() user: User) {
    return this.aiConfigService.findAll(user.tenantId);
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get an automation rule by ID' })
  @ApiResponse({ status: 200, description: 'Returns the rule' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.aiConfigService.findOne(id, user.tenantId);
  }

  @Patch('rules/:id')
  @ApiOperation({ summary: 'Update an automation rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully updated' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateAutomationRuleDto,
    @CurrentUser() user: User,
  ) {
    return this.aiConfigService.update(id, updateRuleDto, user.tenantId);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete an automation rule' })
  @ApiResponse({ status: 200, description: 'Rule successfully deleted' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.aiConfigService.remove(id, user.tenantId);
  }
}
