
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForbiddenException } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // adjust path if needed

@ApiTags('Subscription')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Delete('plans/:id')
  async deletePlan(@Param('id') id: number, @Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new ForbiddenException('Only superadmin can delete plans');
    }
    return this.subscriptionService.deletePlan(Number(id));
  }

  // ======================
  // SUPERADMIN
  // ======================

  @Post('plans')
  async createPlan(@Body() dto: CreateSubscriptionPlanDto, @Request() req) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request. Check JWT guard and token.');
    }
    if (req.user.role !== 'super_admin') {
      throw new ForbiddenException('Only superadmin can create plans');
    }
    return this.subscriptionService.createPlan(dto, req.user.id);
  }

  @Get('plans')
  async getAllPlans() {
    return this.subscriptionService.getAllPlans();
  }

  // ======================
  // ADMIN
  // ======================

  @Get('available-plans')
  async getAvailablePlans() {
    return this.subscriptionService.getAvailablePlans();
  }

  @Post('subscribe')
  async subscribeToPlan(@Request() req, @Body() dto: CreateAdminSubscriptionDto) {
    // Pass adminId and planId as separate arguments
    return this.subscriptionService.subscribeToPlan(req.user.id, dto.planId);
  }

  @Get('current')
  async getCurrentSubscription(@Request() req) {
    return this.subscriptionService.getAdminSubscription(req.user.id);
  }
}