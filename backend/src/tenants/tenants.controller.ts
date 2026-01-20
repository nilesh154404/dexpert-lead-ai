import { Controller, Get, Patch, Body, UseGuards, Post, Delete, Param, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('tenants')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // SUPER_ADMIN endpoints for managing all tenants
  @Get()
  @ApiOperation({ summary: 'Get all tenants (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Returns all tenants' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN role' })
  async getAllTenants(@CurrentUser() user: User) {
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Only SUPER_ADMIN can access all tenants');
    }
    const tenants = await this.tenantsService.findAll();
    return {
      data: tenants,
      total: tenants.length,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tenant (SUPER_ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Tenant successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN role' })
  async createTenant(@Body() createTenantDto: any, @CurrentUser() user: User) {
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Only SUPER_ADMIN can create tenants');
    }
    return this.tenantsService.create(createTenantDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific tenant (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Returns the tenant' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN role' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenantById(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Only SUPER_ADMIN can access tenant details');
    }
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tenant (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Tenant successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN role' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() user: User,
  ) {
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Only SUPER_ADMIN can update tenants');
    }
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tenant (SUPER_ADMIN only)' })
  @ApiResponse({ status: 204, description: 'Tenant successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires SUPER_ADMIN role' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async deleteTenant(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Only SUPER_ADMIN can delete tenants');
    }
    return this.tenantsService.delete(id);
  }

  // User endpoints - get own tenant branding
  @Get('me')
  @ApiOperation({ summary: 'Get current tenant (branding settings)' })
  @ApiResponse({ status: 200, description: 'Returns tenant branding settings' })
  getCurrentTenant(@CurrentUser() user: User) {
    return this.tenantsService.findOne(user.tenantId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update tenant branding settings' })
  @ApiResponse({ status: 200, description: 'Tenant successfully updated' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  update(@Body() updateTenantDto: UpdateTenantDto, @CurrentUser() user: User) {
    return this.tenantsService.update(user.tenantId, updateTenantDto);
  }
}
