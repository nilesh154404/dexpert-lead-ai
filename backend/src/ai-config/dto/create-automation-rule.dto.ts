import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAutomationRuleDto {
  @ApiProperty({ example: 'Auto-qualify high intent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Automatically move leads to Qualified when intent score exceeds threshold' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiProperty({ example: 'Intent score > 85%' })
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty({ example: 'Move to Qualified stage' })
  @IsString()
  @IsNotEmpty()
  action: string;
}
