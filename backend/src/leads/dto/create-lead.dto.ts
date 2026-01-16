import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { LeadStatus } from '../../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ example: 'Sarah Chen' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sarah.chen@techcorp.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1 (555) 123-4567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'TechCorp Inc', required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'VP of Operations', required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ enum: LeadStatus, default: LeadStatus.NEW, required: false })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiProperty({ example: 85, minimum: 0, maximum: 100, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  intentScore?: number;

  @ApiProperty({ example: 'High-intent lead', required: false })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiProperty({ example: 'Ready to buy. Has asked about pricing twice.', required: false })
  @IsString()
  @IsOptional()
  aiSummary?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  assignedToId?: string;
}
