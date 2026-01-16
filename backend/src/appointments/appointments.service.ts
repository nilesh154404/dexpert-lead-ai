import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Lead } from '../entities/lead.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, tenantId: string): Promise<Appointment> {
    const lead = await this.leadRepository.findOne({
      where: { id: createAppointmentDto.leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${createAppointmentDto.leadId} not found`);
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      date: new Date(createAppointmentDto.date),
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(tenantId: string, startDate?: string, endDate?: string) {
    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.lead', 'lead')
      .where('lead.tenantId = :tenantId', { tenantId });

    if (startDate) {
      queryBuilder.andWhere('appointment.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('appointment.date <= :endDate', { endDate });
    }

    queryBuilder.orderBy('appointment.date', 'ASC').addOrderBy('appointment.time', 'ASC');

    return queryBuilder.getMany();
  }

  async findByLead(leadId: string, tenantId: string): Promise<Appointment[]> {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId, tenantId },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    return this.appointmentRepository.find({
      where: { leadId },
      relations: ['lead'],
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (appointment.lead.tenantId !== tenantId) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, tenantId: string): Promise<Appointment> {
    const appointment = await this.findOne(id, tenantId);

    if (updateAppointmentDto.date) {
      appointment.date = new Date(updateAppointmentDto.date);
    }

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const appointment = await this.findOne(id, tenantId);
    await this.appointmentRepository.remove(appointment);
  }
}
