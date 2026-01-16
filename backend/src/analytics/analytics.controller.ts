import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('analytics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  getDashboardStats(@CurrentUser() user: User) {
    return this.analyticsService.getDashboardStats(user.tenantId);
  }

  @Get('lead-sources')
  @ApiOperation({ summary: 'Get lead sources distribution' })
  @ApiResponse({ status: 200, description: 'Returns lead sources statistics' })
  getLeadSources(@CurrentUser() user: User) {
    return this.analyticsService.getLeadSources(user.tenantId, user.role);
  }

  @Get('leads-over-time')
  @ApiOperation({ summary: 'Get leads generated over time' })
  @ApiQuery({ name: 'months', required: false, type: Number, description: 'Number of months (default: 6)' })
  @ApiResponse({ status: 200, description: 'Returns leads over time data' })
  getLeadsOverTime(@Query('months') months: number, @CurrentUser() user: User) {
    return this.analyticsService.getLeadsOverTime(user.tenantId, months, user.role);
  }
}
