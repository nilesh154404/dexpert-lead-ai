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
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if tenant with same name already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { name: createTenantDto.name },
    });

    if (existingTenant) {
      throw new BadRequestException(`Tenant with name "${createTenantDto.name}" already exists`);
    }

    const tenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Tenant[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.tenantRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
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

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    
    // Check if tenant has associated users
    const userCount = await this.userRepository.count({
      where: { tenantId: id },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        `Cannot delete tenant with ID ${id} because it has ${userCount} associated user(s). Please remove all users first.`
      );
    }

    await this.tenantRepository.remove(tenant);
  }
}
