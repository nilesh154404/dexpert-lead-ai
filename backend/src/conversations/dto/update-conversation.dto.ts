import { PartialType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  humanCorrection?: string;
}
