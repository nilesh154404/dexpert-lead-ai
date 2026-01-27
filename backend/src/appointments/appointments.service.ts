import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  /* ---------------- CREATE ---------------- */
  async create(
    dto: CreateAppointmentDto,
    tenantId: string,
    userId?: string,
  ): Promise<Appointment> {
    const lead = await this.leadRepository.findOne({
      where: { id: dto.leadId, tenantId },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    const date = new Date(dto.date);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const staffList = await this.userRepository.find({
      where: { tenantId, status: 'active' as any },
    });

    const eligibleStaff = staffList
      .filter(u =>
        u.role === UserRole.SALES ||
        u.role === UserRole.SUPPORT ||
        u.role === UserRole.MANAGER
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (!eligibleStaff.length) {
      throw new NotFoundException('No staff available');
    }

    const slotAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.lead', 'lead')
      .where('appointment.time = :time', { time: dto.time })
      .andWhere('appointment.date BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere('lead.tenantId = :tenantId', { tenantId })
      .getMany();

    if (slotAppointments.length >= eligibleStaff.length) {
      throw new NotFoundException('All staff already booked for this slot');
    }

    const bookedStaffIds = slotAppointments.map(a => a.staffId);
    const freeStaffOrdered = eligibleStaff.filter(
      s => !bookedStaffIds.includes(s.id)
    );

    if (!freeStaffOrdered.length) {
      throw new NotFoundException('No staff free for this slot');
    }

    const assignedStaffId = freeStaffOrdered[0].id;

    if (!lead.assignedToId) {
      lead.assignedToId = assignedStaffId;
      await this.leadRepository.save(lead);
    }

    const appointment = this.appointmentRepository.create({
      ...dto,
      date,
      staffId: assignedStaffId,
    });

    return this.appointmentRepository.save(appointment);
  }

  /* ---------------- FIND ALL ---------------- */
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
      .leftJoinAndSelect('appointment.staff', 'staff');

    if (role !== UserRole.SUPER_ADMIN) {
      qb.where('lead.tenantId = :tenantId', { tenantId });
    }

    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ORGANISATION) {
      qb.andWhere('appointment.staffId = :userId', { userId });
    }

    if (startDate) qb.andWhere('appointment.date >= :start', { start: startDate });
    if (endDate) qb.andWhere('appointment.date <= :end', { end: endDate });

    return qb.orderBy('appointment.date', 'ASC').getMany();
  }

  /* ---------------- FIND BY LEAD ---------------- */
  async findByLead(
    leadId: string,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, tenantId },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ORGANISATION) {
      if (lead.assignedToId !== userId) {
        throw new NotFoundException('Lead not found');
      }
    }

    return this.appointmentRepository.find({
      where: { leadId },
      relations: ['lead', 'staff'],
      order: { date: 'ASC' },
    });
  }

  /* ---------------- FIND ONE ---------------- */
  async findOne(
    id: string,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead', 'staff'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (role !== UserRole.SUPER_ADMIN && appointment.lead.tenantId !== tenantId) {
      throw new NotFoundException('Appointment not found');
    }

    if (role !== UserRole.SUPER_ADMIN && role !== UserRole.ORGANISATION) {
      if (appointment.staffId !== userId) {
        throw new NotFoundException('Appointment not found');
      }
    }

    return appointment;
  }

  /* ---------------- UPDATE ---------------- */
  async update(
    id: string,
    dto: UpdateAppointmentDto,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const appointment = await this.findOne(id, tenantId, role, userId);
    Object.assign(appointment, dto);
    return this.appointmentRepository.save(appointment);
  }

  /* ---------------- DELETE ---------------- */
  async remove(
    id: string,
    tenantId: string,
    role: UserRole,
    userId?: string,
  ) {
    const appointment = await this.findOne(id, tenantId, role, userId);
    await this.appointmentRepository.remove(appointment);
  }

  /* ---------------- AVAILABLE SLOTS ---------------- */
  async getAvailableSlots(tenantId: string, date?: string) {
    const dateStr = date || new Date().toISOString().split('T')[0];

    const staff = await this.userRepository.find({
      where: { tenantId, status: 'active' as any },
    });

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.lead', 'lead')
      .where('DATE(appointment.date) = :date', { date: dateStr })
      .andWhere('lead.tenantId = :tenantId', { tenantId })
      .getMany();

    const slots: string[] = [];
    for (let h = 9; h < 17; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30:00`);
    }

    return slots.map((time) => {
      const bookedStaffIds = appointments
        .filter((a) => a.time === time)
        .map((a) => a.staffId);

      return {
        date: dateStr,
        time,
        availableStaff: staff.filter((s) => !bookedStaffIds.includes(s.id)),
      };
    });
  }
}
