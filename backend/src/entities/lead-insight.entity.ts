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

export enum InsightType {
  INTEREST = 'interest',
  PAIN = 'pain',
  OBJECTION = 'objection',
  OPPORTUNITY = 'opportunity',
}

@Entity('lead_insights')
export class LeadInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.insights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({
    type: 'enum',
    enum: InsightType,
  })
  type: InsightType;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
