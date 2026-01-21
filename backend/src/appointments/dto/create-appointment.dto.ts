import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AppointmentType, AppointmentStatus } from '../../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Product Demo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: '30 min' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ enum: AppointmentType, default: AppointmentType.VIDEO })
  @IsEnum(AppointmentType)
  @IsOptional()
  type?: AppointmentType;

  @ApiProperty({ example: 'High intent - prepare pricing', required: false })
  @IsString()
  @IsOptional()
  aiNote?: string;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  aiSuggested?: boolean;

  @ApiProperty({ example: 'uuid-of-lead', required: false })
  @IsString()
  @IsOptional()
  leadId?: string;
}
