import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
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

  /* -------------------------------- HELPERS -------------------------------- */

  private toMinutes(time: string): number {
    const [h = '0', m = '0'] = time.split(':');
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  }

  private async getEligibleStaff(tenantId: string) {
    const staffMembers = await this.userRepository.find({
      where: { tenantId, status: 'active' as any },
    });

    return staffMembers.filter(
      (u) => u.role !== UserRole.SUPER_ADMIN && u.role !== UserRole.ORGANISATION,
    );
  }

  private getEndTime(time: string, duration: string): string {
    const [h, m] = time.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const durationMinutes = parseInt(duration); // "30 min" → 30

    const endMinutes = startMinutes + durationMinutes;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;

    return `${endH.toString().padStart(2, '0')}:${endM
      .toString()
      .padStart(2, '0')}:00`;
  }

  /* -------------------------- STAFF AUTO ASSIGN ----------------------------- */

  private async assignStaffToLead(
    leadId: string,
    tenantId: string,
  ): Promise<string | null> {
    const staffMembers = await this.userRepository.find({
      where: { tenantId, status: 'active' as any },
      relations: ['assignedLeads'],
    });

    const eligibleStaff = staffMembers.filter(
      (u) =>
        u.role !== UserRole.SUPER_ADMIN &&
        u.role !== UserRole.ORGANISATION &&
        u.status === 'active',
    );

    if (!eligibleStaff.length) return null;

    const lead = await this.leadRepository.findOne({
      where: { id: leadId },
    });

    if (lead?.assignedToId) return lead.assignedToId;

    const staffWithCounts = eligibleStaff.map((s) => ({
      id: s.id,
      count: s.assignedLeads?.length || 0,
    }));

    staffWithCounts.sort((a, b) => a.count - b.count);

    const assignedStaffId = staffWithCounts[0].id;

    if (lead) {
      lead.assignedToId = assignedStaffId;
      await this.leadRepository.save(lead);
    }

    return assignedStaffId;
  }

  /* ------------------------------ CREATE ------------------------------------ */

  async create(
    dto: CreateAppointmentDto,
    tenantId: string,
    userId?: string,
  ): Promise<Appointment> {
    const eligibleStaff = await this.getEligibleStaff(tenantId);
    if (!eligibleStaff.length) {
      throw new BadRequestException('No active staff available for this tenant');
    }

    const lead = await this.leadRepository.findOne({
      where: { id: dto.leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const appointmentDateStr = dto.date;
    const appointmentEnd = this.getEndTime(dto.time, dto.duration);

    const scheduledAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.lead', 'lead')
      .where('lead.tenantId = :tenantId', { tenantId })
      .andWhere('DATE(appointment.date) = :date', {
        date: appointmentDateStr,
      })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.SCHEDULED,
      })
      .getMany();

    const newStartMinutes = this.toMinutes(dto.time);
    const newEndMinutes = this.toMinutes(appointmentEnd);

    const isStaffAvailable = (staffId: string) => {
      const staffAppointments = scheduledAppointments.filter(
        (appt) => appt.staffId === staffId,
      );

      return !staffAppointments.some((appt) => {
        const apptStart = this.toMinutes(appt.time);
        const apptEnd = apptStart + parseInt(appt.duration);
        return apptStart < newEndMinutes && apptEnd > newStartMinutes;
      });
    };

    const availableStaffIds = eligibleStaff
      .filter((staff) => isStaffAvailable(staff.id))
      .map((staff) => staff.id);

    if (!availableStaffIds.length) {
      throw new BadRequestException(
        'No staff available for the selected time slot',
      );
    }

    let staffId = dto.staffId;
    if (staffId && !availableStaffIds.includes(staffId)) {
      staffId = undefined;
    }

    if (!staffId) {
      const preferredStaff =
        (lead.assignedToId &&
          availableStaffIds.find((id) => id === lead.assignedToId)) ||
        availableStaffIds[0];

      staffId = preferredStaff;
    }

    if (!lead.assignedToId && staffId) {
      lead.assignedToId = staffId;
      await this.leadRepository.save(lead);
    }

    if (!staffId) {
      throw new BadRequestException(
        'No staff available for the selected time slot',
      );
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      date: new Date(dto.date),
      staffId,
    });

    return this.appointmentRepository.save(appointment);
  }

  /* ------------------------------ READ -------------------------------------- */

  async findAll(
    tenantId: string,
    role: UserRole,
    userId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const qb = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.lead', 'lead')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .where('lead.tenantId = :tenantId', { tenantId });

    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ORGANISATION) {
      qb.andWhere('appointment.staffId = :userId', { userId });
    }

    if (startDate) qb.andWhere('appointment.date >= :start', { start: startDate });
    if (endDate) qb.andWhere('appointment.date <= :end', { end: endDate });

    return qb.orderBy('appointment.date', 'ASC').addOrderBy('appointment.time', 'ASC').getMany();
  }
async findByLead(
  leadId: string,
  tenantId: string,
  userRole: UserRole,
  userId?: string,
) {
  const lead = await this.leadRepository.findOne({
    where: { id: leadId, tenantId },
  });

  if (!lead) {
    throw new NotFoundException('Lead not found');
  }

  // Staff can only see their own lead appointments
  if (
    userRole !== UserRole.SUPER_ADMIN &&
    userRole !== UserRole.ORGANISATION
  ) {
    if (lead.assignedToId !== userId) {
      throw new NotFoundException('Lead not found');
    }
  }

  return this.appointmentRepository.find({
    where: { leadId },
    relations: ['lead', 'staff'],
    order: {
      date: 'ASC',
      time: 'ASC',
    },
  });
}

  async findOne(
    id: string,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead', 'staff'],
    });

    if (!appointment || appointment.lead.tenantId !== tenantId) {
      throw new NotFoundException('Appointment not found');
    }

    if (
      role !== UserRole.SUPER_ADMIN &&
      role !== UserRole.ORGANISATION &&
      appointment.staffId !== userId
    ) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  /* ------------------------------ UPDATE ------------------------------------ */

  async update(
    id: string,
    dto: UpdateAppointmentDto,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const appointment = await this.findOne(id, tenantId, role, userId);

    if (dto.date) appointment.date = new Date(dto.date);

    Object.assign(appointment, dto);
    return this.appointmentRepository.save(appointment);
  }

  /* ------------------------------ DELETE ------------------------------------ */

  async remove(
    id: string,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const appointment = await this.findOne(id, tenantId, role, userId);
    await this.appointmentRepository.remove(appointment);
  }

  /* -------------------------- AVAILABLE SLOTS -------------------------------- */

  async getAvailableSlots(tenantId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    const staff = await this.userRepository.find({
      where: { tenantId, status: 'active' as any },
    });

    const eligibleStaff = staff.filter(
      (u) =>
        u.role !== UserRole.SUPER_ADMIN &&
        u.role !== UserRole.ORGANISATION,
    );

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.lead', 'lead')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .where('lead.tenantId = :tenantId', { tenantId })
      .andWhere('DATE(appointment.date) = :date', { date: dateStr })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.SCHEDULED,
      })
      .getMany();

    const slots: string[] = [];
    for (let h = 9; h < 17; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30:00`);
    }

    return slots.map((time) => {
      const slotStart = this.toMinutes(time);
      const slotEnd = slotStart + 30;

      const slotAppointments = appointments.filter((a) => {
        const apptStart = this.toMinutes(a.time);
        const apptEnd = apptStart + parseInt(a.duration);
        return apptStart < slotEnd && apptEnd > slotStart;
      });

      const bookedStaffIds = slotAppointments
        .map((a) => a.staffId)
        .filter(Boolean);

      const availableStaff = eligibleStaff.filter(
        (s) => !bookedStaffIds.includes(s.id),
      );

      return {
        date: dateStr,
        time,
        availableStaff: availableStaff.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          role: s.role,
        })),
        bookedStaff: slotAppointments
          .filter((a) => a.staff)
          .map((a) => ({
            staff: {
              id: a.staff.id,
              name: a.staff.name,
              email: a.staff.email,
              role: a.staff.role,
            },
            bookedBy: {
              appointmentId: a.id,
              leadName: a.lead?.name || 'Lead',
              leadId: a.leadId,
            },
          })),
        totalStaff: eligibleStaff.length,
        availableCount: availableStaff.length,
        bookedCount: bookedStaffIds.length,
      };
    });
  }
}
