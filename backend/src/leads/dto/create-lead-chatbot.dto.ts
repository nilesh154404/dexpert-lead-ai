import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLeadChatbotDto {
  @ApiProperty({ example: 'visitor-uuid-or-domain' })
  @IsString()
  @IsNotEmpty()
  organisationId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'VP of Sales', required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ example: 'Interested in enterprise plan', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
