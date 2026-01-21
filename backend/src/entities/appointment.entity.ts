import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { User } from './user.entity';

export enum AppointmentType {
  VIDEO = 'video',
  PHONE = 'phone',
  IN_PERSON = 'in-person',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id', nullable: true })
  adminId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({ name: 'lead_id', nullable: true })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.appointments, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', name: 'start_time' })
  time: string;

  @Column({ type: 'varchar', length: 50 })
  duration: string;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.VIDEO,
  })
  type: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ name: 'ai_note', type: 'text', nullable: true })
  aiNote: string;

  @Column({ name: 'ai_suggested', type: 'boolean', default: false })
  aiSuggested: boolean;

  @Column({ name: 'staff_id', nullable: true })
  staffId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
