import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logomark?: string;

  @ApiProperty({ example: '222 47% 20%', required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ example: '173 80% 40%', required: false })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  welcomeMessage?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatbotName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chatbotAvatar?: string;
}
