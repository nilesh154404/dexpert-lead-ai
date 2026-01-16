import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { LeadStatus } from '../../entities/lead.entity';

export class LeadQueryDto {
  @ApiProperty({ required: false, description: 'Search by name, email, or company' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ enum: LeadStatus, required: false })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiProperty({ required: false, description: 'Filter by intent score range (e.g., hot=85+, warm=70-84, cool=50-69)' })
  @IsString()
  @IsOptional()
  intentRange?: string;

  @ApiProperty({ required: false, description: 'Filter by assigned user ID' })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, minimum: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
