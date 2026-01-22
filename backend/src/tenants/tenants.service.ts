import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const existingTenant = await this.tenantRepository.findOne({
      where: { name: createTenantDto.name },
    });

    if (existingTenant) {
      throw new BadRequestException(
        `Tenant with name "${createTenantDto.name}" already exists`,
      );
    }

    const tenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.tenantRepository.findAndCount({
      where: { status: 'active' },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
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

  // ✅ SINGLE, CORRECT UPDATE METHOD
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // 🔁 Map frontend isActive → backend status
    if (typeof (updateTenantDto as any).isActive === 'boolean') {
      tenant.status = (updateTenantDto as any).isActive ? 'active' : 'inactive';
      delete (updateTenantDto as any).isActive;
    }

    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async deactivate(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);

    if (tenant.status === 'inactive') {
      throw new BadRequestException('Tenant is already inactive');
    }

    tenant.status = 'inactive';
    return this.tenantRepository.save(tenant);
  }

  async activate(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);

    if (tenant.status === 'active') {
      throw new BadRequestException('Tenant is already active');
    }

    tenant.status = 'active';
    return this.tenantRepository.save(tenant);
  }
}
