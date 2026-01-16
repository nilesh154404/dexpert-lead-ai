import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationRule } from '../entities/automation-rule.entity';
import { CreateAutomationRuleDto } from './dto/create-automation-rule.dto';
import { UpdateAutomationRuleDto } from './dto/update-automation-rule.dto';

@Injectable()
export class AiConfigService {
  constructor(
    @InjectRepository(AutomationRule)
    private automationRuleRepository: Repository<AutomationRule>,
  ) {}

  async create(createRuleDto: CreateAutomationRuleDto, tenantId: string): Promise<AutomationRule> {
    const rule = this.automationRuleRepository.create({
      ...createRuleDto,
      tenantId,
    });

    return this.automationRuleRepository.save(rule);
  }

  async findAll(tenantId: string): Promise<AutomationRule[]> {
    return this.automationRuleRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<AutomationRule> {
    const rule = await this.automationRuleRepository.findOne({
      where: { id, tenantId },
    });

    if (!rule) {
      throw new NotFoundException(`Automation rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: string, updateRuleDto: UpdateAutomationRuleDto, tenantId: string): Promise<AutomationRule> {
    const rule = await this.findOne(id, tenantId);
    Object.assign(rule, updateRuleDto);
    return this.automationRuleRepository.save(rule);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const rule = await this.findOne(id, tenantId);
    await this.automationRuleRepository.remove(rule);
  }
}
