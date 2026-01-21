import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Lead } from '../entities/lead.entity';
import { Appointment } from '../entities/appointment.entity';
import { Conversation } from '../entities/conversation.entity';
import { LeadInsight } from '../entities/lead-insight.entity';
import { Message } from '../entities/message.entity';
import { AutomationRule } from '../entities/automation-rule.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 3306),
      username: this.configService.get<string>('DB_USERNAME', 'root'),
      password: this.configService.get<string>('DB_PASSWORD', 'nilesh'),
      database: this.configService.get<string>('DB_DATABASE', 'kindred_lead_ai'),
      entities: [
        User,
        Tenant,
        Lead,
        Appointment,
        Conversation,
        LeadInsight,
        Message,
        AutomationRule,
        Role,
        Permission,
      ],
      synchronize: this.configService.get<string>('NODE_ENV') !== 'production',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
      charset: 'utf8mb4',
    };
  }
}
