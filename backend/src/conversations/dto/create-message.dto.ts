import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { MessageRole, InsightType } from '../../entities/message.entity';

export class CreateMessageDto {
  @ApiProperty({ example: 'conversation-uuid-here' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ enum: MessageRole })
  @IsEnum(MessageRole)
  @IsNotEmpty()
  role: MessageRole;

  @ApiProperty({ example: 'Hello, I am interested in your product' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: InsightType, required: false })
  @IsEnum(InsightType)
  @IsOptional()
  aiInsightType?: InsightType;

  @ApiProperty({ example: 'High Intent', required: false })
  @IsString()
  @IsOptional()
  aiInsightLabel?: string;

  @ApiProperty({ example: 88, minimum: 0, maximum: 100, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  aiInsightConfidence?: number;
}
