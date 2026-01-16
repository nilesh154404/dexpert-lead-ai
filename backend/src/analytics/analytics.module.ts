import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Lead } from '../entities/lead.entity';
import { Conversation } from '../entities/conversation.entity';
import { Appointment } from '../entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Conversation, Appointment])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
