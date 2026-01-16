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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment successfully created' })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @CurrentUser() user: User) {
    return this.appointmentsService.create(createAppointmentDto, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns list of appointments' })
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.findAll(user.tenantId, startDate, endDate);
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get appointments for a specific lead' })
  @ApiResponse({ status: 200, description: 'Returns list of appointments for the lead' })
  findByLead(@Param('leadId') leadId: string, @CurrentUser() user: User) {
    return this.appointmentsService.findByLead(leadId, user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.findOne(id, user.tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment successfully updated' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.appointmentsService.remove(id, user.tenantId);
  }
}
