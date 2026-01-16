import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiConfigController } from './ai-config.controller';
import { AiConfigService } from './ai-config.service';
import { AutomationRule } from '../entities/automation-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AutomationRule])],
  controllers: [AiConfigController],
  providers: [AiConfigService],
})
export class AiConfigModule {}
