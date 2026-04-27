import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'CRM Tool' })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  display_order?: number;

  @ApiPropertyOptional({
    example: 'Customer Relationship Management tool',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
