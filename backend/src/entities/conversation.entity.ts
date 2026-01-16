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
import { Lead } from './lead.entity';
import { Tenant } from './tenant.entity';
import { Message } from './message.entity';

export enum ConversationSentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

export enum ConversationAccuracy {
  ACCURATE = 'accurate',
  NEEDS_IMPROVEMENT = 'needs-improvement',
  PENDING = 'pending',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => Lead, (lead) => lead.conversations)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ name: 'intent_score', type: 'int', default: 0 })
  intentScore: number;

  @Column({
    type: 'enum',
    enum: ConversationSentiment,
    default: ConversationSentiment.NEUTRAL,
  })
  sentiment: ConversationSentiment;

  @Column({
    type: 'enum',
    enum: ConversationAccuracy,
    default: ConversationAccuracy.PENDING,
  })
  aiAccuracy: ConversationAccuracy;

  @Column({ name: 'human_correction', type: 'text', nullable: true })
  humanCorrection: string;

  @OneToMany(() => Message, (message) => message.conversation, { cascade: true })
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
