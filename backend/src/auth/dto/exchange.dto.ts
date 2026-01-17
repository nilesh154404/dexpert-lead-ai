import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum ClientType {
  WEB = 'web',
  MOBILE = 'mobile',
  API = 'api',
}

export class ExchangeDto {
  @ApiProperty({ example: 'tenant-uuid-here' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ example: 'tenant-secret-key-here' })
  @IsString()
  @IsNotEmpty()
  tenantSecret: string;

  @ApiProperty({ enum: ClientType, example: ClientType.API })
  @IsEnum(ClientType)
  @IsNotEmpty()
  clientType: ClientType;
}
