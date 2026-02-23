
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { AdminSubscription } from './entities/admin-subscription.entity';
import { AdminSubscriptionUsage } from './entities/admin-subscription-usage.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { CreateAdminSubscriptionDto } from './dto/create-admin-subscription.dto';

@Injectable()
export class SubscriptionService {
  // Delete a plan (superadmin only)
  async deletePlan(planId: number) {
    // Optionally: check for active subscriptions using this plan and handle accordingly
    return this.planRepo.delete(planId);
  }
    // Public method to get usage for a subscription
    async getUsageForSubscription(subscriptionId: number) {
      return this.usageRepo.findOne({
        where: { subscription: { id: subscriptionId } },
      });
    }

    // Public method to save usage
    async saveUsage(usage: AdminSubscriptionUsage) {
      return this.usageRepo.save(usage);
    }
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,

    @InjectRepository(AdminSubscription)
    private readonly adminSubRepo: Repository<AdminSubscription>,

    @InjectRepository(AdminSubscriptionUsage)
    private readonly usageRepo: Repository<AdminSubscriptionUsage>,
  ) {}

  // ============================
  // SUPERADMIN
  // ============================

  // Create subscription plan
  async createPlan(dto: CreateSubscriptionPlanDto, createdBy: string) {
    const plan = this.planRepo.create({
      ...dto,
      createdBy,
    });

    return this.planRepo.save(plan);
  }

  // Get all plans (superadmin)
  async getAllPlans() {
    return this.planRepo.find();
  }

  // ============================
  // ADMIN
  // ============================

  // Get available plans
  async getAvailablePlans() {
    return this.planRepo.find();
  }

  // Subscribe admin to a plan
  async subscribeToPlan(adminId: string, planId: number) {
    // Validate plan
    const plan = await this.planRepo.findOne({
      where: { id: planId },
    });
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    // Check for existing active subscription
    let subscription = await this.adminSubRepo.findOne({
      where: { adminId, status: 'active' },
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    if (subscription) {
      // Update the plan and dates
      subscription.planId = plan.id;
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      await this.adminSubRepo.save(subscription);
      // Optionally reset usage counters here if desired
      return subscription;
    } else {
      // Create new subscription
      subscription = this.adminSubRepo.create({
        adminId,
        planId: plan.id,
        startDate,
        endDate,
        status: 'active',
      });
      const savedSubscription = await this.adminSubRepo.save(subscription);
      // Initialize usage counters
      const usage = this.usageRepo.create({
        subscription: savedSubscription,
      });
      await this.usageRepo.save(usage);
      return savedSubscription;
    }
  }

  // Get current active subscription of admin
  async getAdminSubscription(adminId: string) {
    return this.adminSubRepo.findOne({
      where: { adminId, status: 'active' },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  // ============================
  // LIMIT CHECKS
  // ============================

  // Check if admin can create product
  async canCreateProduct(adminId: string): Promise<boolean> {
    console.log('[canCreateProduct] adminId:', adminId);
    const subscription = await this.getAdminSubscription(adminId);
    console.log('[canCreateProduct] subscription:', subscription);
    if (!subscription) return false;

    const usage = await this.usageRepo.findOne({
      where: { subscription: { id: subscription.id } },
      relations: ['subscription', 'subscription.plan'],
    });
    console.log('[canCreateProduct] usage:', usage);

    const limit = subscription.plan.productCreateLimit;
    if (limit === -1) return true; // unlimited
    return usage.productCreated < limit;
  }

  // Increment product creation count
  async incrementProductCreate(adminId: string) {
    const subscription = await this.getAdminSubscription(adminId);
    if (!subscription) return;

    const usage = await this.usageRepo.findOne({
      where: { subscription: { id: subscription.id } },
    });
    if (!usage) return;
    usage.productCreated += 1;
    await this.usageRepo.save(usage);
  }

  // Check if admin can create prompt
  async canCreatePrompt(adminId: string): Promise<boolean> {
    const subscription = await this.getAdminSubscription(adminId);
    if (!subscription) return false;

    const usage = await this.usageRepo.findOne({
      where: { subscription: { id: subscription.id } },
      relations: ['subscription', 'subscription.plan'],
    });

    const limit = subscription.plan.promptCreateLimit;
    if (limit === -1) return true; // unlimited
    return usage.promptCreated < limit;
  }

  // Increment prompt creation count
  async incrementPromptCreate(adminId: string) {
    const subscription = await this.getAdminSubscription(adminId);
    if (!subscription) return;

    const usage = await this.usageRepo.findOne({
      where: { subscription: { id: subscription.id } },
    });
    if (!usage) return;
    usage.promptCreated += 1;
    await this.usageRepo.save(usage);
  }

  // Increment prompt edit count
  async incrementPromptEdit(adminId: string) {
    const subscription = await this.getAdminSubscription(adminId);
    if (!subscription) return;

    const usage = await this.usageRepo.findOne({
      where: { subscription: { id: subscription.id } },
    });
    if (!usage) return;
    usage.promptEdited += 1;
    await this.usageRepo.save(usage);
  }

  // ============================
  // EXPIRY HANDLING
  // ============================

  // Manually expire old subscriptions (can be used in cron)
  async expireSubscriptions() {
    await this.adminSubRepo.update(
      {
        endDate: LessThan(new Date()),
        status: 'active',
      },
      { status: 'expired' },
    );
  }
}