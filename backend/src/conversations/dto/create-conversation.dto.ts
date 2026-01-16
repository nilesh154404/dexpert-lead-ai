import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ConversationSentiment, ConversationAccuracy } from '../../entities/conversation.entity';

export class CreateConversationDto {
  @ApiProperty({ example: 'lead-uuid-here' })
  @IsString()
  @IsNotEmpty()
  leadId: string;

  @ApiProperty({ example: 'High-intent inquiry about enterprise pricing', required: false })
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty({ example: 92, minimum: 0, maximum: 100, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  intentScore?: number;

  @ApiProperty({ enum: ConversationSentiment, required: false })
  @IsEnum(ConversationSentiment)
  @IsOptional()
  sentiment?: ConversationSentiment;

  @ApiProperty({ enum: ConversationAccuracy, required: false })
  @IsEnum(ConversationAccuracy)
  @IsOptional()
  aiAccuracy?: ConversationAccuracy;
}
