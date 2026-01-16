import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { Appointment } from './appointment.entity';
import { Conversation } from './conversation.entity';
import { LeadInsight } from './lead-insight.entity';

export enum LeadStatus {
  NEW = 'new',
  QUALIFIED = 'qualified',
  NURTURING = 'nurturing',
  CONVERTED = 'converted',
  LOST = 'lost',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  role: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ name: 'intent_score', type: 'int', default: 0 })
  intentScore: number;

  @Column({ name: 'confidence_score', type: 'int', nullable: true })
  confidenceScore: number;

  @Column({ nullable: true })
  source: string;

  @Column({ name: 'ai_summary', type: 'text', nullable: true })
  aiSummary: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'assigned_to_id', nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo: User;

  @OneToMany(() => Appointment, (appointment) => appointment.lead)
  appointments: Appointment[];

  @OneToMany(() => Conversation, (conversation) => conversation.lead)
  conversations: Conversation[];

  @OneToMany(() => LeadInsight, (insight) => insight.lead)
  insights: LeadInsight[];

  @Column({ name: 'last_interaction_at', type: 'timestamp', nullable: true })
  lastInteractionAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
