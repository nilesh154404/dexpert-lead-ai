import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Lead } from '../entities/lead.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Auto-assign staff to a lead based on load balancing
   */
  private async assignStaffToLead(leadId: string, tenantId: string): Promise<string | null> {
    // Get staff members (excluding SUPER_ADMIN and ORGANISATION roles)
    const staffMembers = await this.userRepository.find({
      where: {
        tenantId,
        status: 'active' as any,
      },
      relations: ['assignedLeads'],
    });

    // Filter out non-staff roles
    const eligibleStaff = staffMembers.filter(
      (user) =>
        user.role !== UserRole.SUPER_ADMIN &&
        user.role !== UserRole.ORGANISATION &&
        user.status === 'active',
    );

    if (eligibleStaff.length === 0) {
      return null;
    }

    // If lead already has assigned staff, use that
    const lead = await this.leadRepository.findOne({
      where: { id: leadId },
      relations: ['assignedTo'],
    });

    if (lead?.assignedToId) {
      return lead.assignedToId;
    }

    // Load balancing: assign to staff with fewest assigned leads
    const staffWithCounts = eligibleStaff.map((staff) => ({
      id: staff.id,
      count: staff.assignedLeads?.length || 0,
    }));

    staffWithCounts.sort((a, b) => a.count - b.count);
    const assignedStaffId = staffWithCounts[0].id;

    // Update lead assignment
    if (lead) {
      lead.assignedToId = assignedStaffId;
      await this.leadRepository.save(lead);
    }

    return assignedStaffId;
  }

  async create(createAppointmentDto: CreateAppointmentDto, tenantId: string, userId?: string): Promise<Appointment> {
    const lead = await this.leadRepository.findOne({
      where: { id: createAppointmentDto.leadId, tenantId },
      relations: ['assignedTo'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${createAppointmentDto.leadId} not found`);
    }

    // Check for conflicts
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        date: new Date(createAppointmentDto.date),
        time: createAppointmentDto.time,
        status: 'scheduled' as any,
      },
      relations: ['lead'],
    });

    if (conflictingAppointment && conflictingAppointment.lead.tenantId === tenantId) {
      // Check if same staff or same lead
      if (conflictingAppointment.staffId || conflictingAppointment.leadId === createAppointmentDto.leadId) {
        throw new BadRequestException('Time slot is already booked');
      }
    }

    // Auto-assign staff if not provided
    let staffId = createAppointmentDto.staffId;
    if (!staffId) {
      // First try to use lead's assigned staff
      if (lead.assignedToId) {
        staffId = lead.assignedToId;
      } else {
        // Auto-assign staff to lead and use that
        staffId = (await this.assignStaffToLead(lead.id, tenantId)) || undefined;
      }
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      date: new Date(createAppointmentDto.date),
      staffId,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(
    tenantId: string,
    userRole: UserRole,
    userId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.lead', 'lead')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .where('lead.tenantId = :tenantId', { tenantId });

    // RBAC: Staff can only see their own appointments
    if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.ORGANISATION) {
      if (userId) {
        queryBuilder.andWhere('appointment.staffId = :userId', { userId });
      }
    }

    if (startDate) {
      queryBuilder.andWhere('appointment.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('appointment.date <= :endDate', { endDate });
    }

    queryBuilder.orderBy('appointment.date', 'ASC').addOrderBy('appointment.time', 'ASC');

    return queryBuilder.getMany();
  }

  async findByLead(leadId: string, tenantId: string, userRole: UserRole, userId?: string): Promise<Appointment[]> {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    const whereCondition: any = { leadId };

    // RBAC: Staff can only see appointments for leads assigned to them
    if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.ORGANISATION) {
      if (userId) {
        // Check if lead is assigned to this staff member
        if (lead.assignedToId !== userId) {
          throw new NotFoundException(`Lead with ID ${leadId} not found`);
        }
        whereCondition.staffId = userId;
      }
    }

    return this.appointmentRepository.find({
      where: whereCondition,
      relations: ['lead', 'staff'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string, userRole: UserRole, userId?: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead', 'staff'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (appointment.lead.tenantId !== tenantId) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // RBAC: Staff can only see their own appointments
    if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.ORGANISATION) {
      if (userId && appointment.staffId !== userId) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    tenantId: string,
    userRole: UserRole,
    userId?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, tenantId, userRole, userId);

    if (updateAppointmentDto.date) {
      appointment.date = new Date(updateAppointmentDto.date);
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string, tenantId: string, userRole: UserRole, userId?: string): Promise<void> {
    const appointment = await this.findOne(id, tenantId, userRole, userId);
    await this.appointmentRepository.remove(appointment);
  }

  /**
   * Get available time slots for appointment booking by organization
   */
  async getAvailableSlots(tenantId: string, date?: string): Promise<any[]> {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all staff members for this organization
    const staffMembers = await this.userRepository.find({
      where: {
        tenantId,
        status: 'active' as any,
      },
    });

    const eligibleStaff = staffMembers.filter(
      (user) => user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ORGANISATION,
    );

    // Get existing appointments for the date
    const dateStr = targetDate.toISOString().split('T')[0];
    const existingAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.lead', 'lead')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .where('DATE(appointment.date) = :date', { date: dateStr })
      .andWhere('appointment.status = :status', { status: 'scheduled' })
      .getMany();

    // Filter appointments by tenant
    const tenantAppointments = existingAppointments.filter((apt) => apt.lead.tenantId === tenantId);

    // Define time slots (9 AM to 5 PM, 30-minute intervals)
    const timeSlots: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00:00`);
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30:00`);
    }

    // Build available slots with staff availability
    const availableSlots: any[] = [];

    for (const slot of timeSlots) {
      const slotAppointments = tenantAppointments.filter((apt) => apt.time === slot);

      // For each staff member, check if they're available
      for (const staff of eligibleStaff) {
        const staffAppointment = slotAppointments.find((apt) => apt.staffId === staff.id);

        availableSlots.push({
          date: targetDate.toISOString().split('T')[0],
          time: slot,
          staff: {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
          },
          available: !staffAppointment,
          bookedBy: staffAppointment
            ? {
                appointmentId: staffAppointment.id,
                leadName: staffAppointment.lead.name,
                leadId: staffAppointment.leadId,
              }
            : null,
        });
      }
    }

    // Group slots by time, then show available staff for each time slot
    const groupedSlots: any[] = [];
    
    for (const slot of timeSlots) {
      const slotStaff = availableSlots.filter((s) => s.time === slot);
      const availableStaff = slotStaff.filter((s) => s.available).map((s) => s.staff);
      const bookedStaff = slotStaff.filter((s) => !s.available);
      
      groupedSlots.push({
        date: targetDate.toISOString().split('T')[0],
        time: slot,
        availableStaff,
        bookedStaff: bookedStaff.map((s) => ({
          staff: s.staff,
          bookedBy: s.bookedBy,
        })),
        totalStaff: eligibleStaff.length,
        availableCount: availableStaff.length,
        bookedCount: bookedStaff.length,
      });
    }

    return groupedSlots;
  }
}
