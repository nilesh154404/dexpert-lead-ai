import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { PermissionModule, PermissionAction } from '../entities/permission.entity';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.CREATE })
  @ApiOperation({ summary: 'Create a new appointment with auto staff assignment' })
  @ApiResponse({ status: 201, description: 'Appointment successfully created' })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @CurrentUser() user: User) {
    return this.appointmentsService.create(createAppointmentDto, user.tenantId, user.id);
  }

  @Get()
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get all appointments (filtered by role/permissions)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns list of appointments' })
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.findAll(user.tenantId, user.role, user.id, startDate, endDate);
  }

  @Get('lead/:leadId')
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get appointments for a specific lead' })
  @ApiResponse({ status: 200, description: 'Returns list of appointments for the lead' })
  findByLead(@Param('leadId') leadId: string, @CurrentUser() user: User) {
    return this.appointmentsService.findByLead(leadId, user.tenantId, user.role, user.id);
  }

  @Get('available-slots')
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get available appointment slots grouped by staff' })
  @ApiQuery({ name: 'date', required: false, description: 'Date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns available slots with staff information' })
  getAvailableSlots(@Query('date') date: string, @CurrentUser() user: User) {
    return this.appointmentsService.getAvailableSlots(user.tenantId, date);
  }

  @Get(':id')
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.READ })
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.findOne(id, user.tenantId, user.role, user.id);
  }

  @Patch(':id')
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.UPDATE })
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment successfully updated' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, user.tenantId, user.role, user.id);
  }

  @Delete(':id')
  @RequirePermissions({ module: PermissionModule.APPOINTMENTS, action: PermissionAction.DELETE })
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.remove(id, user.tenantId, user.role, user.id);
  }
}
