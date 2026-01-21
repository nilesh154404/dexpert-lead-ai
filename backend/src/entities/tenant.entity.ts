import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Lead } from './lead.entity';
import { Conversation } from './conversation.entity';
import { AutomationRule } from './automation-rule.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  logomark: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
   mobileNumber?: string;

  @Column({ name: 'primary_color', default: '222 47% 20%' })
  primaryColor: string;

  @Column({ name: 'accent_color', default: '173 80% 40%' })
  accentColor: string;

  @Column({ name: 'font_family', nullable: true })
  fontFamily: string;

  @Column({ name: 'welcome_message', nullable: true })
  welcomeMessage: string;

  @Column({ name: 'chatbot_name', nullable: true })
  chatbotName: string;

  @Column({ name: 'chatbot_avatar', nullable: true })
  chatbotAvatar: string;

  @Column({ name: 'tenant_secret', nullable: true, select: false })
  tenantSecret: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Lead, (lead) => lead.tenant)
  leads: Lead[];

  @OneToMany(() => Conversation, (conversation) => conversation.tenant)
  conversations: Conversation[];

  @OneToMany(() => AutomationRule, (rule) => rule.tenant)
  automationRules: AutomationRule[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
