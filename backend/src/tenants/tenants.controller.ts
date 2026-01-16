import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
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
