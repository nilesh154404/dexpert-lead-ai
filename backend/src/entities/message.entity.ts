import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export enum MessageRole {
  LEAD = 'lead',
  AI = 'ai',
  HUMAN = 'human',
}

export enum InsightType {
  INTENT = 'intent',
  SENTIMENT = 'sentiment',
  TOPIC = 'topic',
  OBJECTION = 'objection',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conversation_id' })
  conversationId: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'ai_insight_type', type: 'enum', enum: InsightType, nullable: true })
  aiInsightType: InsightType;

  @Column({ name: 'ai_insight_label', nullable: true })
  aiInsightLabel: string;

  @Column({ name: 'ai_insight_confidence', type: 'int', nullable: true })
  aiInsightConfidence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
