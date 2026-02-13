import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'CRM Tool' })
  @IsString()
  @IsNotEmpty()
  product_name: string;
}
