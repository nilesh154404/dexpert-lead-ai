import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'CRM Tool Pro' })
  @IsNotEmpty()
  @IsString()
  product_name: string;
}
