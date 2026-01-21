import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { PermissionModule, PermissionAction } from '../entities/permission.entity';

@ApiTags('tenants')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.TENANTS, action: PermissionAction.CREATE })
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - tenant name already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.TENANTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get all tenants (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of tenants' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.tenantsService.findAll(page, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current tenant (branding settings)' })
  @ApiResponse({ status: 200, description: 'Returns tenant branding settings' })
  getCurrentTenant(@CurrentUser() user: User) {
    return this.tenantsService.findOne(user.tenantId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current tenant branding settings' })
  @ApiResponse({ status: 200, description: 'Tenant successfully updated' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  updateCurrent(@Body() updateTenantDto: UpdateTenantDto, @CurrentUser() user: User) {
    return this.tenantsService.update(user.tenantId, updateTenantDto);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.TENANTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Returns tenant details' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.TENANTS, action: PermissionAction.UPDATE })
  @ApiOperation({ summary: 'Update a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant successfully updated' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: PermissionModule.TENANTS, action: PermissionAction.DELETE })
  @ApiOperation({ summary: 'Delete a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant successfully deleted' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 400, description: 'Bad request - tenant has associated users' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
