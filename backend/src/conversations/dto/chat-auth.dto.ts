import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { MessageRole, InsightType } from '../../entities/message.entity';

export class ChatAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ enum: MessageRole })
  @IsEnum(MessageRole)
  role: MessageRole; // MUST be enum, not string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: InsightType, required: false })
  @IsEnum(InsightType)
  @IsOptional()
  aiInsightType?: InsightType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  aiInsightLabel?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  aiInsightConfidence?: number;
}
