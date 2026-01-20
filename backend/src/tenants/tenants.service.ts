import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import * as crypto from 'crypto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async create(createTenantDto: any): Promise<Tenant> {
    const tenantSecret = crypto.randomBytes(32).toString('hex');
    
    const tenant = new Tenant();
    tenant.name = createTenantDto.name;
    tenant.logo = createTenantDto.logo || null;
    tenant.logomark = createTenantDto.logomark || null;
    tenant.primaryColor = createTenantDto.primaryColor || '222 47% 20%';
    tenant.accentColor = createTenantDto.accentColor || '173 80% 40%';
    tenant.fontFamily = createTenantDto.fontFamily || null;
    tenant.welcomeMessage = createTenantDto.welcomeMessage || null;
    tenant.chatbotName = createTenantDto.chatbotName || null;
    tenant.chatbotAvatar = createTenantDto.chatbotAvatar || null;
    tenant.tenantSecret = tenantSecret;

    const saved = await this.tenantRepository.save(tenant);
    return saved;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async delete(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }
}
